import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopquesComponent } from './popques.component';

describe('PopquesComponent', () => {
  let component: PopquesComponent;
  let fixture: ComponentFixture<PopquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
