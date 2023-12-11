import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device } from '../../shared/device.model';

import { dateDisplayOptions } from 'src/app/utils/utils';

@Component({
  selector: 'app-device-item-grid-template',
  templateUrl: './device-item-grid-template.component.html',
  styleUrls: ['./device-item-grid-template.component.scss'],
})
export class DeviceItemGridTemplateComponent {
  @Input() device?: Device & { editMode: boolean };
  @Output() updateDeviceName = new EventEmitter<
    Device & { editMode: boolean }
  >();

  dateDisplayOptions = dateDisplayOptions;

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
