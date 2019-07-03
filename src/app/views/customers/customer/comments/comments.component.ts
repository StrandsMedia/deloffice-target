import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { dada } from 'src/app/common/interfaces/letterhead';

import { AuthService } from 'src/app/common/services/auth.service';
import { CommentsService } from 'src/app/common/services/comments.service';
import { MaterialService } from 'src/app/common/services/material.service';

import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-comms',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommsComponent implements OnInit {
  @Input() data: any;
  comments: Observable<any>;
  status: 1 | 2 = 1;
  user: any;
  state = 'Submit';

  public newCmtForm = this.fb.group({
    user_id: null,
    username: null,
    date: null,
    comment: [null, Validators.required],
    step: [this.status, Validators.required],
    cust_id: [null, Validators.required],
    data: 1
  });

  constructor(
    private auth: AuthService,
    private cmt: CommentsService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.get();
    this.newCmtForm.controls['user_id'].setValue(this.user.user_id);
    this.newCmtForm.controls['username'].setValue(this.user.username);
    this.newCmtForm.controls['cust_id'].setValue(this.data.cust_id);
  }

  get() {
    this.comments = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.cmt.getComments(this.status, 0, +params['id'], this.data.data)
      }),
      map((cmts) => cmts.records),
      tap(cmts => {
        this.cdRef.detectChanges()
        this.newCmtForm.controls['data'].setValue(this.data.data)
      })
    )
  }

  trackByFn(index, item) {
    return index;
  }

  toggleState(status) {
    status === 1 ? this.status = 1 : this.status = 2;
    this.get();
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

  insert() {
    this.state = 'Submitting...';
    this.newCmtForm.controls['date'].setValue(dada());
    this.newCmtForm.controls['step'].setValue(this.status);

    this.cmt.insertCmt(this.newCmtForm.value).subscribe(
      (data) => {
        console.log(data);
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        console.log(err.error);
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.newCmtForm.reset();
        this.newCmtForm.controls['user_id'].setValue(this.user.user_id);
        this.newCmtForm.controls['username'].setValue(this.user.username);
        this.newCmtForm.controls['cust_id'].setValue(this.data.cust_id);
        this.state = 'Submit';
      }
    );
  }

}
