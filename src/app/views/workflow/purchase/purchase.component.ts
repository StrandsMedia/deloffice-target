import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  dataSource$: Observable<any>;
  loading = false;
  choice = 'date';
  columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'invoice_no',
    'vehicle',
    'process'
  ];

  constructor(private fb: FormBuilder, private wf: WorkflowService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.readByStatus(4).pipe(
      map(report => report.records),
      delay(2000),
      tap((e) => {
        this.loading = !this.loading;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

}
