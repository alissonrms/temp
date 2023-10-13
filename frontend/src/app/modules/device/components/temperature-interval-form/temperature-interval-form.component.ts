import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';

interface DialogState {
  isOpen: boolean;
}

@Component({
  selector: 'app-temperature-interval-form',
  templateUrl: './temperature-interval-form.component.html',
  styleUrls: ['./temperature-interval-form.component.scss'],
  providers: [UtilsService],
})
export class TemperatureIntervalFormComponent {
  @Input() dialogState: DialogState = { isOpen: false };
  temperatureIntervalForm: FormGroup;

  constructor(private utilsService: UtilsService) {
    this.temperatureIntervalForm = new FormGroup({
      initialTime: new FormControl(null, [Validators.required]),
      finalTime: new FormControl(null, [Validators.required]),
      temperature: new FormControl(0, [Validators.required]),
    });
  }

  isFieldValid(fieldName: string): boolean | undefined {
    return this.utilsService.isFieldValid(
      this.temperatureIntervalForm,
      fieldName
    );
  }

  closeDialog(): void {
    this.dialogState.isOpen = false;
    this.temperatureIntervalForm.reset();
  }

  submitForm(): void {}
}
