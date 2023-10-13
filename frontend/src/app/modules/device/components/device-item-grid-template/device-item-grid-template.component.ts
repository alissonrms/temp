import { Component, Input } from '@angular/core';
import { Device } from '../../shared/device.model';

@Component({
  selector: 'app-device-item-grid-template',
  templateUrl: './device-item-grid-template.component.html',
  styleUrls: ['./device-item-grid-template.component.scss']
})
export class DeviceItemGridTemplateComponent {
  @Input() device?: Device;
}
