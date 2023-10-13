import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureHistoryChartComponent } from './temperature-history-chart.component';

describe('TemperatureHistoryChartComponent', () => {
  let component: TemperatureHistoryChartComponent;
  let fixture: ComponentFixture<TemperatureHistoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureHistoryChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
