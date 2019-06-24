import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGPComponent } from './view-gp.component';

describe('ViewGPComponent', () => {
  let component: ViewGPComponent;
  let fixture: ComponentFixture<ViewGPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
