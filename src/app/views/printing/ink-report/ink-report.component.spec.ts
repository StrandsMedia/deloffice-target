import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InkReportComponent } from './ink-report.component';

describe('InkReportComponent', () => {
  let component: InkReportComponent;
  let fixture: ComponentFixture<InkReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InkReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
