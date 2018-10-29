import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { interval, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss']
})
export class BtnComponent implements OnInit {
  loading;
  error;
  success;

  @Input() data: any;

  @Output() clickEd: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  buttonFunction() {
    this.loading = true;
    this.error = false;
    this.success = false;
    const n = 2000;

    of(true).pipe(
      delay(n),
      tap(v => {
        this.clickEd.emit(v);
        this.loading = !this.loading;
        if (this.data.status === 'error') {
          this.error = true;
        } else {
          this.success = true;
        }
      }),
      delay(n + 500),
      tap(v => {
        setTimeout(() => {
          this.error = false;
          this.success = false;
        }, 1500);
      })
    ).subscribe(() => {
      //
    });
  }

}
