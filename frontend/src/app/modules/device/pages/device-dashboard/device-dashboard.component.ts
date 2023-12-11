import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Device,
  addIntervalToDeviceConfig,
  removeIntervalFromDeviceConfig,
} from '../../shared/device.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import {
  convertDailyMinutesTimestampToFormattedDate,
  dateDisplayOptions,
} from 'src/app/utils/utils';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-device-dashboard',
  templateUrl: './device-dashboard.component.html',
  styleUrls: ['./device-dashboard.component.scss'],
  providers: [ConfirmationService],
})
export class DeviceDashboardComponent implements OnInit {
  device?: Device & { editMode: boolean };
  @ViewChild(Menu) menu!: Menu;

  isLoading = false;
  temperatureModalForm = {
    isOpen: false,
  };

  dateDisplayOptions = dateDisplayOptions;

  menuItems: MenuItem[] = [];
  currentIntervalIndex = -1;

  constructor(
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private confirmationService: ConfirmationService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.menu.containerViewChild.nativeElement.contains(e.target)) {
        this.currentIntervalIndex = -1;
      }
    });
  }

  ngOnInit(): void {
    const deviceMac = this.activatedRoute.snapshot.params['deviceMacAddress'];
    this.fetchAndListenToDeviceChanges(deviceMac);
    this.updateMenu();
  }

  updateMenu(): void {
    this.menuItems = [
      {
        label: `Remover Intervalo ${this.getCurrentIntervalLabel()}`,
        icon: 'pi pi-fw pi-trash',
        command: () => {
          this.handleDeleteInterval();
        },
      },
    ];
  }

  private getCurrentIntervalLabel(): string {
    if(this.currentIntervalIndex === -1) return '';
    
    const prevInterval =
      this.currentIntervalIndex > 0
        ? this.device?.temperatureConfig[this.currentIntervalIndex - 1]
        : this.device?.temperatureConfig[
            this.device?.temperatureConfig.length - 1
          ];

    return `${convertDailyMinutesTimestampToFormattedDate(
      prevInterval!.timeToStop === 1440 ? 0 : prevInterval!.timeToStop
    )} - ${convertDailyMinutesTimestampToFormattedDate(
      this.device?.temperatureConfig[this.currentIntervalIndex].timeToStop ||
        1440
    )}\n${
      this.device?.temperatureConfig[this.currentIntervalIndex].temperature
    }°C`;
  }

  fetchAndListenToDeviceChanges(macAddress: string): void {
    this.isLoading = true;
    this.firestore
      .collection('devices')
      .doc(macAddress)
      .snapshotChanges()
      .subscribe((snapshot) => {
        if (snapshot.payload.exists) {
          const deviceData = snapshot.payload.data() as Device;
          this.device = {
            ...deviceData,
            temperatureConfig:
              this.device?.temperatureConfig || deviceData.temperatureConfig,
            editMode: false,
          };
          this.isLoading = false;
        } else {
          this.router.navigate(['/', 'app']);
        }
      });
  }

  async handleUpdateDeviceName(
    device: Device & { editMode: boolean }
  ): Promise<void> {
    if (device.name.length > 3) {
      await this.firestore
        .collection('devices')
        .doc(device.macAddress)
        .update({ name: device.name });
      return;
    }

    this.utilsService.showInfoMessage(
      'O nome do dispositivo deve ter pelo menos 3 caracteres'
    );
    device.editMode = true;
  }

  get goalTemperature(): number {
    if (!this.device) return 0;

    const currentTimestamp = Date.now();
    const temperatureConfig = this.device?.temperatureConfig;
    for (const interval of temperatureConfig) {
      if (currentTimestamp > interval.timeToStop) {
        return interval.temperature;
      }
    }

    return 0;
  }

  openDialog(): void {
    this.temperatureModalForm.isOpen = true;
  }

  async saveDeviceTemperatureConfig(): Promise<void> {
    await this.firestore
      .collection('devices')
      .doc(this.device!.macAddress)
      .update({ temperatureConfig: this.device!.temperatureConfig });
    return;
  }

  handleNewInterval(temperatureIntervalConfig: {
    initialTime: number;
    finalTime: number;
    temperature: number;
  }): void {
    addIntervalToDeviceConfig(
      this.device!,
      temperatureIntervalConfig.initialTime,
      temperatureIntervalConfig.finalTime,
      temperatureIntervalConfig.temperature
    );

    this.saveDeviceTemperatureConfig();
  }

  handleOpenIntervalOptions(event: any): void {
    event.originalEvent.stopPropagation();
    this.currentIntervalIndex = event.element.index;
    this.updateMenu();
  }

  handleDeleteInterval(): void {
    if (this.device!.temperatureConfig.length <= 1) {
      this.utilsService.showInfoMessage(
        'Você não pode remover todos os intervalos de configuração'
      );
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja remover?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        removeIntervalFromDeviceConfig(this.device!, this.currentIntervalIndex);
        this.device!.temperatureConfig = [...this.device!.temperatureConfig];
        this.saveDeviceTemperatureConfig();
      },
    });
  }

  get actualTemperature(): number {
    if (!this.device) return 0;
    return this.device.temperatureHistory.length > 0
      ? this.device.temperatureHistory[
          this.device.temperatureHistory.length - 1
        ].temperature
      : 0;
  }

  get actualTemperatureTime(): number {
    if (!this.device) return new Date().getTime();
    return this.device.temperatureHistory.length > 0
      ? this.device.temperatureHistory[
          this.device.temperatureHistory.length - 1
        ].time
      : 0;
  }
}
