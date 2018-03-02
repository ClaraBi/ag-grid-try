import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillItemsGridComponent } from './waybill-items-grid.component';

describe('WaybillItemsGridComponent', () => {
  let component: WaybillItemsGridComponent;
  let fixture: ComponentFixture<WaybillItemsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillItemsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillItemsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
