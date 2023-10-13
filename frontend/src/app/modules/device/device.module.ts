import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceListComponent } from './pages/device-list/device-list.component';
import { DeviceDashboardComponent } from './pages/device-dashboard/device-dashboard.component';
import { TemperatureIntervalFormComponent } from './components/temperature-interval-form/temperature-interval-form.component';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { DeviceItemGridTemplateComponent } from './components/device-item-grid-template/device-item-grid-template.component';
import { DeviceItemListTemplateComponent } from './components/device-item-list-template/device-item-list-template.component';
import { TemperatureHistoryChartComponent } from './components/temperature-history-chart/temperature-history-chart.component';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDashboardComponent,
    TemperatureIntervalFormComponent,
    DeviceItemGridTemplateComponent,
    DeviceItemListTemplateComponent,
    TemperatureHistoryChartComponent,
  ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    ReactiveFormsModule,
    DataViewModule,
    DropdownModule,
    PickListModule,
    OrderListModule,
    RatingModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    ChartModule
  ],
})
export class DeviceModule {}
