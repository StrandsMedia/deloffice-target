import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { DebtorsService } from 'src/app/common/services/debtors.service';

import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { dada } from 'src/app/common/interfaces/letterhead';
import { AuthService } from 'src/app/common/services/auth.service';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit, DoCheck {
  dataSource$: Observable<any>;
  loadedData: any;
  changed = false;
  loading = false;
  date = dada();

  choices = [
    { name: 'To Contact', yes: false, no: false, done: false },
    { name: 'Discussion', yes: false, no: false, done: false, children: true },
    { name: 'Awaiting Feedback', yes: false, no: false, done: false },
    { name: 'Expecting Payment', yes: true, no: true, done: true, field: 'payment' },
    { name: 'Cheque Ready', yes: true, no: false, done: true, field: 'cheque' },
    { name: 'Cleared', yes: false, no: false, done: false },
  ];

  childchoices = [
    { id: 'dispute', name: 'Dispute', yes: true, no: true, done: true },
    { name: 'Docs to Provide: ', yes: false, no: false, done: false, children: true },
    { id: 'adjs', name: 'Adjustments to be made', yes: true, no: false, done: true },
  ];

  grandchildchoices = [
    { id: 'inv', name: 'INV' },
    { id: 'dn', name: 'DN' },
    { id: 'crn', name: 'CRN' },
    { id: 'oth', name: 'OTH' },
  ];

  public dbtControlForm: FormGroup = this.fb.group({
    status: null,
    dispute: null,
    inv: null,
    dn: null,
    crn: null,
    oth: null,
    adjs: null,
    payment: null,
    cheque: null,
    issue: null,
    dc_id: null
  });

  public newCmtForm: FormGroup = this.fb.group({
    comment: null,
    user_id: null,
    date: this.date,
    cust_id: null,
    dc_id: null
  });
  user: any;

  constructor(
    private auth: AuthService,
    private dbt: DebtorsService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private route: ActivatedRoute,
  ) {
    auth.currentUser.subscribe((data) => this.user = data);
    this.newCmtForm.controls['user_id'].setValue(+this.user.user_id);
  }

  ngOnInit(): void {
    this.get();
  }

  ngDoCheck() {
  }

  get() {
    return this.dataSource$ = combineLatest(this.route.params, this.route.queryParams).pipe(
      map((res: any) => ({ params: res[0].id, query: res[1].data})),
      switchMap((params) => {
        return this.dbt.getControlById(params.params, params.query);
      }),
      map((res: any) => {
        if (res.records) {
          this.dbtControlForm.controls['status'].setValue(res.records[0].status);
          this.dbtControlForm.controls['dispute'].setValue(res.records[0].dispute);
          this.dbtControlForm.controls['inv'].setValue(res.records[0].inv);
          this.dbtControlForm.controls['dn'].setValue(res.records[0].dn);
          this.dbtControlForm.controls['crn'].setValue(res.records[0].crn);
          this.dbtControlForm.controls['oth'].setValue(res.records[0].oth);
          this.dbtControlForm.controls['payment'].setValue(res.records[0].payment);
          this.dbtControlForm.controls['cheque'].setValue(res.records[0].cheque);
          this.dbtControlForm.controls['issue'].setValue(res.records[0].issue);
          this.dbtControlForm.controls['dc_id'].setValue(res.records[0].dc_id);

          this.newCmtForm.controls['dc_id'].setValue(+res.records[0].dc_id);
          this.newCmtForm.controls['cust_id'].setValue(+res.records[0].cust_id);
          return res.records[0];
        }
        return res;
      })
    );
  }

  changeStatus() {
    this.changed = true;
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

  saveForm() {
    this.loading = true;
    this.dbt.updateControl(this.dbtControlForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.loading = false;
        this.changed = false;
      }
    );
  }

  insert() {
    this.dbt.insertCmtCtrl(this.newCmtForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.loading = false;
        this.newCmtForm.reset();
      }
    );
  }

}
