import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureIntervalFormComponent } from './temperature-interval-form.component';

describe('TemperatureIntervalFormComponent', () => {
  let component: TemperatureIntervalFormComponent;
  let fixture: ComponentFixture<TemperatureIntervalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureIntervalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureIntervalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
