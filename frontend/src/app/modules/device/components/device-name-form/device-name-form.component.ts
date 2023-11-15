import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Device } from '../../shared/device.model';

@Component({
  selector: 'app-device-name-form',
  templateUrl: './device-name-form.component.html',
  styleUrls: ['./device-name-form.component.scss'],
})
export class DeviceNameFormComponent {
  @ViewChild('deviceName') nameInput!: ElementRef<HTMLSpanElement>;
  @Input() device?: Device & { editMode: boolean };
  @Output() updateDeviceName = new EventEmitter<Device & { editMode: boolean }>();

  handleDeviceEditMode() {
    this.device!.editMode = true;

    setTimeout(() => {
      this.nameInput.nativeElement.focus();
      const range = document.createRange();
      const sel = window.getSelection();

      if (sel) {
        range.selectNodeContents(this.nameInput.nativeElement);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 30);
  }

  handleEnterPressed(event: any): void {
    event.preventDefault();
    this.handleUpdateDeviceName();
  }

  handleUpdateDeviceName() {
    this.nameInput.nativeElement.textContent =
      this.nameInput.nativeElement.textContent?.trim() ?? '';
    this.device!.name = this.nameInput.nativeElement.textContent;
    this.device!.editMode = false;
    this.updateDeviceName.emit(this.device!);
  }
}
