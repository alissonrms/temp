import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceItemGridTemplateComponent } from './device-item-grid-template.component';

describe('DeviceItemGridTemplateComponent', () => {
  let component: DeviceItemGridTemplateComponent;
  let fixture: ComponentFixture<DeviceItemGridTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceItemGridTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceItemGridTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
