import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ForgotPasswordModalComponent } from './components/forgot-password-modal/forgot-password-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [DialogService],
})
export class LoginComponent {
  forgotPasswordModalRef: DynamicDialogRef | undefined;
  loginForm: FormGroup;

  constructor(
    public dialogService: DialogService,
    public layoutService: LayoutService,
    public authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async handleSubmit(): Promise<void> {
    this.loginForm.disable();
    await this.authService.signIn(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    );
    this.loginForm.enable();
  }

  showForgotPasswordModal() {
    this.forgotPasswordModalRef = this.dialogService.open(
      ForgotPasswordModalComponent,
      {
        header: 'Recuperar Senha',
        closeOnEscape: true,
        dismissableMask: true,
      }
    );
  }

  ngOnDestroy() {
    if (this.forgotPasswordModalRef) {
      this.forgotPasswordModalRef.close();
    }
  }
}
