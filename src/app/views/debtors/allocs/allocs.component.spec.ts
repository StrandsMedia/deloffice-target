import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocsComponent } from './allocs.component';

describe('AllocsComponent', () => {
  let component: AllocsComponent;
  let fixture: ComponentFixture<AllocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
