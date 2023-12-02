import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { convertDateToDailyMinutesTimestamp } from 'src/app/utils/utils';

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
  @Output() formSubmitted = new EventEmitter<{
    initialTime: number;
    finalTime: number;
    temperature: number;
  }>();
  temperatureIntervalForm: FormGroup;

  constructor(private utilsService: UtilsService) {
    const initialTime = new Date();
    initialTime.setHours(0, 0, 0);
    this.temperatureIntervalForm = new FormGroup({
      initialTime: new FormControl(initialTime, [Validators.required]),
      finalTime: new FormControl(initialTime, [Validators.required]),
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

  submitForm(): void {
    this.formSubmitted.emit({
      initialTime: convertDateToDailyMinutesTimestamp(this.temperatureIntervalForm.get('initialTime')?.value),
      finalTime: convertDateToDailyMinutesTimestamp(this.temperatureIntervalForm.get('finalTime')?.value),
      temperature: this.temperatureIntervalForm.get('temperature')?.value,
    });
  }
}
