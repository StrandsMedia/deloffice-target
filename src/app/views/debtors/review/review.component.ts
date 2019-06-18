import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { DebtorsService } from '../../../common/services/debtors.service';
import { MaterialService } from '../../../common/services/material.service';

import { dada } from '../../../common/interfaces/letterhead';

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  review$: Observable<any>;
  comment$: Observable<any>;
  users$: Observable<any>;
  user: any;
  reviewbatch: any[] = [];
  selected: any;
  selecteduser: any;
  loading = false;

  selecteddata: any;

  public columns = [
    'company',
    'cmp',
    'rem',
    'status',
    'comment',
    'reviewper',
    'lastrev',
    'release'
  ];

  public releaseReviewForm: FormGroup = this.fb.group({
    dc_id: null,
    reviewPeriod: 30,
    user: null
  });

  public newCmtForm: FormGroup = this.fb.group({
    comment: null,
    user_id: null,
    date: dada(),
    cust_id: null,
    dc_id: null
  });

  constructor(
    private auth: AuthService,
    private dbt: DebtorsService,
    private fb: FormBuilder,
    private mdc: MaterialService
  ) {
    this.auth.currentUser.subscribe(data => {
      this.user = data;
      this.selecteduser = this.user.user_id;
    });
    this.users$ = this.auth.getUsers().pipe(
      map(res => res.records),
      map((res: any[]) => {
        return res.filter(user => {
          return user.dept == 'Admin' || user.dept == 'Accounting';
        });
      })
    );
  }

  ngOnInit() {
    this.get();
  }

  get() {
    const object = {
      active: 1,
      user: this.user.user_id
    };
    this.review$ = this.dbt.readReview(object).pipe(
      map((res) => res.records)
    );
  }

  getOther() {
    const object = {
      active: 1,
      user: this.selecteduser
    };
    this.review$ = this.dbt.readReview(object).pipe(
      map((res) => res.records)
    );
  }

  renderComments(row) {
    this.selecteddata = row;
    this.loadComments();
  }

  loadComments() {
    this.comment$ = this.dbt.getControlById(this.selecteddata.dc_id, this.selecteddata.data).pipe(
      map(res => res.records[0]),
      tap(recs => {
        this.newCmtForm.controls['dc_id'].setValue(+recs.dc_id);
        this.newCmtForm.controls['cust_id'].setValue(+recs.cust_id);
        this.newCmtForm.controls['user_id'].setValue(this.user.user_id);
        this.newCmtForm.controls['date'].setValue(dada());
      }),
      map((res: any) => res.comments)
    );
  }

  insertCmt() {
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
        this.selected = null;
        this.loading = false;
        this.newCmtForm.reset();
        this.loadComments();
      }
    );
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

  prepareReview(row) {
    this.selected = row;
    this.releaseReviewForm.controls['user'].setValue(this.user.user_id);
    this.releaseReviewForm.controls['dc_id'].setValue(row.dc_id);
  }

  releaseReview() {
    this.reviewbatch.push(this.selected.dr_id);
    this.dbt.releaseReview({
      dr_id: this.reviewbatch,
      reviewPeriod: this.releaseReviewForm.value.reviewPeriod
    }).subscribe(
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
      }
    );
  }

}
