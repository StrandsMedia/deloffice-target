import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MaterialService } from '../../common/services/material.service';
import { CommentsService } from '../../common/services/comments.service';
import { AuthService } from '../../common/services/auth.service';

import { Observable, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  public loading: boolean;
  private _tabbar: any;
  public dataSource$: Observable<any>;
  public users: Observable<any>;
  public comments: Observable<any>;

  public defaultUser: any;

  public response;

  public toggle = 1;
  public columns = [
    'cd_id',
    'date',
    'customer',
    'company',
    'comment',
    'sales_rep'
  ];

  public searchstate = 0;

  public filterForm = this._fb.group({
    user: ['']
  });

  public searchForm = this._fb.group({
    from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    user: null
  });


  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _cmt: CommentsService,
    private _mdc: MaterialService
  ) {
    this._auth.currentUser.subscribe(data => {
      this.defaultUser = data;
      this.searchForm.controls['user'].setValue(this.defaultUser.user_id);
    });
  }

  ngOnInit() {
    this.get();
    this.getUsers();
    this.initTab();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this._cmt.getComments(this.toggle).pipe(
      map((data: any) => {
        if (data.records) {
          return data.records;
        }
        return data;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  toggleToggle() {
    this.toggle === 1 ? this.toggle = 2 : this.toggle = 1;
    this.get();
  }

  searchByUser() {
    this.loading = true;
    return this.dataSource$ = this._cmt.getComments(this.toggle, this.filterForm.value.user).pipe(
      map((data: any) => {
        return data.records;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  getUsers() {
    return this.users = this._auth.getUsers().pipe(
      map((users: any) => users.records)
    );
  }

  initTab() {
    this._tabbar = this._mdc.materialTabBar('.mdc-tab-bar');
  }

  exportCSV() {
    this.resetState();
    this._cmt.tbltoCSV('text.csv');
  }

  resetState() {
    this.searchstate = 0;
    this.response = null;
  }

  searchCmts() {
    this.searchstate = 3;
    this.comments = this._cmt.getCmtReport(this.searchForm.value).pipe(
      tap((v) => {
        if (v.status === 'okay') {
          this.searchstate = 2;
        } else {
          this.searchstate = 1;
        }
      }),
      map(cmt => {
        if (cmt.records) {
          return cmt.records;
        }
        return cmt;
      }),
      tap((cmt) => {
        if (cmt.message) {
          this.response = cmt.message;
        }
      })
    );
  }

  public get state() {
    switch (this.searchstate) {
      case 0:
        return 'Search';
        break;
      case 1:
        return 'Failed';
        break;
      case 2:
        return 'Ready';
        break;
      case 3:
        return 'Searching...';
        break;
    }
  }

}
