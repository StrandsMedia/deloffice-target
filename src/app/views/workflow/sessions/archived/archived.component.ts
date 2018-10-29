import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { WorkflowService } from '../../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss']
})
export class ArchivedComponent implements OnInit {
  dataSource$: Observable<any>;
  date = new Date();
  asc = true;
  clicked = 0;
  loading = false;
  columns = [
    'jobid',
    'date',
    'type',
    'vehicle',
    'invoices',
    'close'
  ];

  vehicles = [
    '4730 ZR 01',
    '5271 ZR 02',
    '629 MR 03',
    '3213 ZU 04',
    '3652 ZT 04',
    '2772 ZV 05',
    '5027 ZR 06'
  ];

  public searchDate = this.fb.group({
    date: [new Date(), Validators.required]
  });

  constructor(private fb: FormBuilder, private wf: WorkflowService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    return this.dataSource$ = this.wf.sessionRead(0, this.formatDate(this.date)).pipe(
      map((data: any) => {
        if (data.records) {
          return data.records;
        } else {
          return data;
        }
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  formatDate(date) {
    // tslint:disable-next-line:prefer-const
    let d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        // tslint:disable-next-line:prefer-const
        year = d.getFullYear();

    // tslint:disable-next-line:curly
    if (month.length < 2) month = '0' + month;
    // tslint:disable-next-line:curly
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  update() {
    this.date = new Date(this.searchDate.value.date);
    this.get();
  }

}
