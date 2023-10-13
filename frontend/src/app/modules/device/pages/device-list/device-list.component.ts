import { Component } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Device } from '../../shared/device.model';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent {
  devices: Device[] = [
    {
      id: 'asdasldkjf123',
      name: 'Freezer Área de Churrasco',
      actualTemperature: 0,
      temperatureConfig: [],
      temperatureHistory: [],
    },
    {
      id: 'asdasldkjf1223',
      name: 'Freezer Cozinha',
      actualTemperature: 2,
      temperatureConfig: [],
      temperatureHistory: [],
    },
    {
      id: 'asdasldkj4f1223',
      name: 'Frigobar Sala',
      actualTemperature: -4,
      temperatureConfig: [],
      temperatureHistory: [],
    },
  ];

  sortOrder: number = 0;

  sortField: string = '';

  constructor() {}

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
