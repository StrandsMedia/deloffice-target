import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth.service';
import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {
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
  selected: any = null;
  user: any;

  public creditForm: FormGroup = this.fb.group({
    status: [null, Validators.required],
    note: null,
    comment: null,
    user: null,
    step: 9,
    workflow_id: null
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private wf: WorkflowService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.get();
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.readByStatus(11).pipe(
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

  assign(row) {
    this.creditForm.controls['step'].setValue(7);
    this.creditForm.controls['user'].setValue(+this.user.user_id);
    this.creditForm.controls['workflow_id'].setValue(+row.workflow_id);
    this.selected = row;
  }

  processNote() {
    this.wf.changeStatus(this.creditForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.creditForm.reset();
      }
    );
  }

}
