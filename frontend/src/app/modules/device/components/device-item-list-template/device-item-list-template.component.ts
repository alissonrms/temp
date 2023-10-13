import { Component, Input } from '@angular/core';
import { Device } from '../../shared/device.model';

@Component({
  selector: 'app-device-item-list-template',
  templateUrl: './device-item-list-template.component.html',
  styleUrls: ['./device-item-list-template.component.scss']
})
export class DeviceItemListTemplateComponent {
  @Input() device?: Device;
}
