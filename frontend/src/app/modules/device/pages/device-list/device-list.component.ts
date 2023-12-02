import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Device } from '../../shared/device.model';
import { DataView } from 'primeng/dataview';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';
import { forkJoin, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {
  devices: Device[] = [];

  sortOrder: number = 0;
  sortField: string = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private utilsService: UtilsService
  ) {
    this.fetchUserDevices();
  }

  ngOnInit(): void {}

  async fetchUserDevices() {
    this.isLoading = true;
  
    this.authService.getUser().pipe(
      switchMap((user) => {
        if (!user) {
          // handle the case where user is null
          return [];
        }
  
        return this.firestore.collection('users').doc(user.uid).get().pipe(
          switchMap((userDataSnapshot: any) => {
            this.devices = [];
  
            const deviceObservables = userDataSnapshot.data().devices.map((deviceRef: any) => {
              return from(deviceRef.get());
            });
  
            return forkJoin(deviceObservables);
          })
        );
      })
    ).subscribe((deviceSnapshots) => {
      for (const deviceSnapshot of deviceSnapshots as any[]) {
        if (deviceSnapshot.exists) {
          const deviceData = deviceSnapshot.data() as Device;
          this.registerDevice(deviceData);
        }
      }
      this.isLoading = false;
    });
  }

  registerDevice(device: Device): void {
    device.temperatureConfig.forEach((config) => {
      config.timeToStop =
        this.utilsService.convertTimestampToActualTimestampDate(
          config.timeToStop
        );
    });
    this.devices.push(device);
    this.listenToDeviceChanges(device.macAddress);
  }

  listenToDeviceChanges(macAddress: string): void {
    this.firestore
      .collection('devices')
      .doc(macAddress)
      .snapshotChanges()
      .subscribe((snapshot) => {
        if (snapshot.payload.exists) {
          const deviceData = snapshot.payload.data() as Device;
          this.devices[
            this.findDeviceIndexByMacAddress(macAddress)
          ].actualTemperatureInfos = deviceData.actualTemperatureInfos;
        } else {
          console.log('Documento do dispositivo não encontrado.');
        }
      });
  }

  findDeviceIndexByMacAddress(macAddress: string): number {
    return this.devices.findIndex((device) => device.macAddress === macAddress);
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

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }
}
