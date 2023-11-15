import { Injectable } from '@angular/core';
import { Device } from '../modules/device/shared/device.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private database: AngularFireDatabase) { }

  addDeviceForUser(userId: string, device: Device) {
    return this.database.list(`/users/${userId}/devices`).push(device);
  }
}