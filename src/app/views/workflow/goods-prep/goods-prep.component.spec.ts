import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsPrepComponent } from './goods-prep.component';

describe('GoodsPrepComponent', () => {
  let component: GoodsPrepComponent;
  let fixture: ComponentFixture<GoodsPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
