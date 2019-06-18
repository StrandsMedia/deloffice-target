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
      map((data) => {
        const newrecs = data['records'].filter(sesh => {
          if (sesh['vehicle'] === 'pickup') {
            const today = new Date();
            const daydiff = Math.ceil((Math.abs(today.getTime() - new Date(sesh.sessionDate).getTime())) / (1000 * 3600 * 24));
            if (daydiff >= 0 && daydiff <= 2) {
              return sesh;
            } else {

            }
          } else {
            return sesh;
          }
        });
        data.records = newrecs;
        return data;
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
