import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Device } from '../../shared/device.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { dateDisplayOptions } from 'src/app/utils/utils';

@Component({
  selector: 'app-device-dashboard',
  templateUrl: './device-dashboard.component.html',
  styleUrls: ['./device-dashboard.component.scss'],
})
export class DeviceDashboardComponent implements OnInit {
  device?: Device & { editMode: boolean };

  isLoading = false;
  temperatureModalForm = {
    isOpen: false,
  };

  dateDisplayOptions = dateDisplayOptions;

  constructor(
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    const deviceMac = this.activatedRoute.snapshot.params['deviceMacAddress'];
    this.fetchAndListenToDeviceChanges(deviceMac);
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
          this.device = { ...deviceData, editMode: false };
          this.device.temperatureConfig.forEach((config) => {
            config.initialTime =
              this.utilsService.convertTimestampToActualTimestampDate(
                config.initialTime
              );
            config.finalTime =
              this.utilsService.convertTimestampToActualTimestampDate(
                config.finalTime
              );
          });
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
      if (
        currentTimestamp >= interval.initialTime &&
        currentTimestamp <= interval.finalTime
      ) {
        return interval.temperature;
      }
    }

    return this.device?.actualTemperatureInfos.temperature || 0;
  }

  openDialog(): void {
    this.temperatureModalForm.isOpen = true;
  }
}
