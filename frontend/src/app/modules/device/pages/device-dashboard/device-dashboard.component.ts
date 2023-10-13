import { Component } from '@angular/core';

@Component({
  selector: 'app-device-dashboard',
  templateUrl: './device-dashboard.component.html',
  styleUrls: ['./device-dashboard.component.scss'],
})
export class DeviceDashboardComponent {
  temperatureModalForm = {
    isOpen: false,
  };

  openDialog(): void {
    this.temperatureModalForm.isOpen = true;
  }
}
