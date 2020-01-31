import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { DebtorsService } from '../../../common/services/debtors.service';
import { MaterialService } from '../../../common/services/material.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {
  creditBlocked$: Observable<any>;
  user: any;

  public columns = [
    'date',
    'customerCode',
    'company_name',
    'status',
    'issue',
    'amount',
    'edit'
  ];

  public creditForm: FormGroup = this.fb.group({
    workflow_id: null,
    cust_id: null,
    data: null,
    comment: null,
    user: null,
    cheque: null,
    amount: null
  })

  constructor(
    private auth: AuthService,
    private dbt: DebtorsService,
    private fb: FormBuilder,
    private mdc: MaterialService
  ) {
    this.auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.get();
  }

  get() {
    this.creditBlocked$ = this.dbt.getCreditControl().pipe(
      map(data => data.records)
    );
  }

  trackByFn(index, item) {
    return index;
  }

  bindData(row) {
    this.creditForm.controls['workflow_id'].setValue(row.workflow_id);
    this.creditForm.controls['cust_id'].setValue(row.cust_id);
    this.creditForm.controls['data'].setValue(row.data);
    this.creditForm.controls['user'].setValue(this.user.user_id);
  }

  cancel() {
    this.creditForm.reset();
  }

  submit(status: string) {
    const data = this.creditForm.value;
    switch (status) {
      case 'approve':
        data.status = 28;
        break;
      case 'decline':
        data.status = 29;
        break;
    }
    console.log(data);

    this.dbt.handleCreditCtrl(data)
    .subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.creditForm.reset();
        this.get();
      }
    )
  }

}
