import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-device-info-step',
  templateUrl: './device-info-step.component.html',
  styleUrls: ['./device-info-step.component.scss'],
})
export class DeviceInfoStepComponent {
  @Output() formSubmited = new EventEmitter<string>();

  @Input() infoForm: FormGroup = new FormGroup({});

  constructor() {}

  handleSubmit(): void {
    this.formSubmited.emit();
  }
}
