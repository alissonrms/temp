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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { StepsModule } from 'primeng/steps';
import { InputMaskModule } from 'primeng/inputmask';
import { DeviceItemGridTemplateComponent } from './components/device-item-grid-template/device-item-grid-template.component';
import { DeviceItemListTemplateComponent } from './components/device-item-list-template/device-item-list-template.component';
import { TemperatureHistoryChartComponent } from './components/temperature-history-chart/temperature-history-chart.component';
import { DeviceRegisterComponent } from './pages/device-register/device-register.component';
import { SerialInputStepComponent } from './pages/device-register/components/serial-input-step/serial-input-step.component';
import { DeviceInfoStepComponent } from './pages/device-register/components/device-info-step/device-info-step.component';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { CodeInputModule } from 'angular-code-input';
import { DateFnsModule } from 'ngx-date-fns';
import { DeviceNameFormComponent } from './components/device-name-form/device-name-form.component';
import { DashboardLoadingPageComponent } from './pages/device-dashboard/components/dashboard-loading-page/dashboard-loading-page.component';
import { TemperatureConfigChartComponent } from './components/temperature-config-chart/temperature-config-chart.component';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDashboardComponent,
    TemperatureIntervalFormComponent,
    DeviceItemGridTemplateComponent,
    DeviceItemListTemplateComponent,
    TemperatureHistoryChartComponent,
    DeviceRegisterComponent,
    SerialInputStepComponent,
    DeviceInfoStepComponent,
    DeviceNameFormComponent,
    DashboardLoadingPageComponent,
    TemperatureConfigChartComponent,
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
    ChartModule,
    StepsModule,
    InputMaskModule,
    FormsModule,
    TooltipModule,
    SkeletonModule,
    MenuModule,
    ConfirmDialogModule,
    CodeInputModule.forRoot({
      codeLength: 12,
      isCharsCode: true,
      isFocusingOnLastByClickIfFilled: true,
      initialFocusField: 0
    }),
    DateFnsModule.forRoot()
  ],
})
export class DeviceModule {}
