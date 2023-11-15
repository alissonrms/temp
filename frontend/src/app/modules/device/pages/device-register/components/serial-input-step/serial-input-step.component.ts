import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-serial-input-step',
  templateUrl: './serial-input-step.component.html',
  styleUrls: ['./serial-input-step.component.scss'],
})
export class SerialInputStepComponent {
  @Input() isLoading = false;
  @Output() codeCompleted = new EventEmitter<string>();

  onCodeCompleted(code: string) {
    this.codeCompleted.emit(code);
  }
}
