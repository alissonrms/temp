import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Device, TemperatureInterval } from '../../shared/device.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, lastValueFrom, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.scss'],
})
export class DeviceRegisterComponent {
  activeStep: number = 0;
  formSteps: MenuItem[] = [];
  infoForm: FormGroup;

  device: Device = {
    macAddress: '',
    name: '',
    actualTemperatureInfos: {
      temperature: 0,
      updatedAt: new Date().getTime(),
    },
    temperatureConfig: [],
    temperatureHistory: [],
  };

  isLoading = false;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private utilsService: UtilsService,
    private router: Router
  ) {
    this.infoForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit() {
    this.formSteps = [{ label: 'Código Serial' }, { label: 'Informações' }];
  }

  handleCodeCompleted(code: string): void {
    this.device.macAddress = code.toUpperCase();
    this.isLoading = true;
    this.findDeviceByCode(code).subscribe({
      next: (device) => {
        if (device) {
          this.activeStep++;
          return;
        }

        this.utilsService.showErrorMessage('Código inválido');
        this.isLoading = false;
      },
      error: () => {
        this.utilsService.showErrorMessage('Código inválido');
        this.isLoading = false;
      },
    });
  }

  findDeviceByCode(code: string) {
    return this.firestore
      .collection('devices')
      .doc(code)
      .get()
      .pipe(
        switchMap((device) => {
          if (device.exists) {
            return of(device.data());
          }
          return of(null);
        }),
        catchError(() => {
          return of(null);
        })
      );
  }

  async handleRegisterNewDevice(): Promise<void> {
    this.infoForm.disable();
    await this.updateDevice();
    this.addDeviceToUserArray();
  }

  async updateDevice(): Promise<void> {
    this.device = {
      ...this.device,
      ...this.infoForm.value,
      userId: this.authService.userData.uid,
    };
    this.device.temperatureConfig.push(this.getTemperatureInitialConfig());

    const deviceCollection = this.firestore.collection('devices');
    const deviceDocument = deviceCollection.doc(this.device.macAddress);
    await deviceDocument.update(this.device);
  }

  addDeviceToUserArray() {
    const usersCollection = this.firestore.collection('users');
    const userDocument = usersCollection.doc(this.authService.userData.uid);
    return userDocument.get().subscribe((userSnapshot) => {
      if (userSnapshot.exists) {
        const user = userSnapshot.data() as any;
        if (!user.devices) {
          user.devices = [];
        }
        const deviceCollection = this.firestore.collection('devices');
        const deviceDocument = deviceCollection.doc(this.device.macAddress);
        user.devices.push(deviceDocument.ref);
        userDocument
          .update({ devices: user.devices })
          .then(() => {
            this.utilsService.showSuccessMessage(
              'Dispositivo cadastrado com sucesso'
            );
            this.router.navigate(['/', 'app']);
          })
          .catch(() => {
            this.utilsService.showErrorMessage(
              'Não foi possivel cadastrar o dispositivo'
            );
            this.infoForm.enable();
          });
      } else {
        console.log('Usuário não encontrado.');
        this.infoForm.enable();
      }
    });
  }

  getTemperatureInitialConfig(): TemperatureInterval {
    const initialHourInitialConfig = new Date();

    initialHourInitialConfig.setHours(0, 0, 0);

    return {
      timeToStop: initialHourInitialConfig.getTime(),
      temperature: 0,
    };
  }
}
