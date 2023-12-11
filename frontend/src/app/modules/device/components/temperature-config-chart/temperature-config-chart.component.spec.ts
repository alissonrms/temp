import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureConfigChartComponent } from './temperature-config-chart.component';

describe('TemperatureConfigChartComponent', () => {
  let component: TemperatureConfigChartComponent;
  let fixture: ComponentFixture<TemperatureConfigChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureConfigChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureConfigChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
