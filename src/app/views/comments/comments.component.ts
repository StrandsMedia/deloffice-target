import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MaterialService } from '../../common/services/material.service';
import { CommentsService } from '../../common/services/comments.service';
import { AuthService } from '../../common/services/auth.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  loading: boolean;
  tabbar: any;
  dataSource$: Observable<any>;
  users: Observable<any>;
  toggle = 1;
  columns = [
    'cd_id',
    'date',
    'customer',
    'comment',
    'sales_rep'
  ];

  public filterForm = this.fb.group({
    user: ['']
  });


  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private cmt: CommentsService,
    private mdc: MaterialService
  ) { }

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
    return this.dataSource$ = this.cmt.getComments(this.toggle).pipe(
      map((data: any) => {
        return data.records;
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
    return this.dataSource$ = this.cmt.getComments(this.toggle, this.filterForm.value.user).pipe(
      map((data: any) => {
        return data.records;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  getUsers() {
    return this.users = this.auth.getUsers().pipe(
      map((users: any) => users.records)
    );
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

  exportCSV() {
    this.cmt.tbltoCSV('text.csv');
  }

}
