import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  dataSource$: Observable<any>;
  loading = false;
  choice = 'date';
  columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'invoice_no',
    'credit_no',
    'vehicle',
  ];

  public searchForm = this.fb.group({
    date1: [null],
    date2: [null],
    invoice_no: [null],
    company_name: [null]
  });

  constructor(private fb: FormBuilder, private wf: WorkflowService) {
    //
  }

  ngOnInit() {
    //
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.readSession(this.searchForm.value).pipe(
      map(delivery => delivery.records),
      delay(2000),
      tap((e) => {
        this.searchForm.reset();
        this.loading = !this.loading;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

}
