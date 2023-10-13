import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from './pages/device-list/device-list.component';
import { DeviceDashboardComponent } from './pages/device-dashboard/device-dashboard.component';

const routes: Routes = [
    { path: '', component: DeviceListComponent },
    { path: ':deviceId', component: DeviceDashboardComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeviceRoutingModule {}
