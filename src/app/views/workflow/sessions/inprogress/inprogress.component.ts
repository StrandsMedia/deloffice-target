import { Component, OnInit } from '@angular/core';

import { WorkflowService } from '../../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-inprogress',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogress.component.scss']
})
export class InprogressComponent implements OnInit {
  dataSource$: Observable<any>;
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

  constructor(private wf: WorkflowService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    return this.dataSource$ = this.wf.sessionRead(2).pipe(
      map((data: any) => {
        if (data.records) {
          return data.records;
        } else {
          return data.message;
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

}
