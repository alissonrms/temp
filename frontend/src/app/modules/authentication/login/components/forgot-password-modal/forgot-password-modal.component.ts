import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss']
})
export class ForgotPasswordModalComponent {
  forgotPasswordForm: FormGroup;

  constructor(private ref: DynamicDialogRef, private authService: AuthService) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  async handleSubmit(): Promise<void> {
    try {
      await this.authService.forgotPassword(this.forgotPasswordForm.get('email')?.value);
      this.ref.close();
    } catch {
      this.ref.close();
    }
  }
}
