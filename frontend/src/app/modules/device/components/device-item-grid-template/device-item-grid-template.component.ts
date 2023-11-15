import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
}
