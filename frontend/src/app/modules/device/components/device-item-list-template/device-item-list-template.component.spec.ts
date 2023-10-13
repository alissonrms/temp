import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceItemListTemplateComponent } from './device-item-list-template.component';

describe('DeviceItemListTemplateComponent', () => {
  let component: DeviceItemListTemplateComponent;
  let fixture: ComponentFixture<DeviceItemListTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceItemListTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceItemListTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
