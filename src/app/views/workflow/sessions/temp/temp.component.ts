import { Component, OnInit } from '@angular/core';

import { WorkflowService } from '../../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.scss']
})
export class TempComponent implements OnInit {
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
    return this.dataSource$ = this.wf.sessionRead(1).pipe(
      map((data: any) => {
        return data.records;
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
