import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  dataSource$: Observable<any>;
  loading = false;
  choice = 'date';
  columns = [
    'user',
    'inquiry',
    'quotesend',
    'orderconfirm',
    'purchase',
    'invoicing',
    'invoiced',
    'comments'
  ];

  public searchForm = this.fb.group({
    date1: [this.formatDate(new Date())],
    date2: [this.formatDate(new Date())],
  });

  constructor(private fb: FormBuilder, private wf: WorkflowService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.readUserData(this.searchForm.value).pipe(
      map(userdata => userdata.records),
      delay(2000),
      tap((e) => {
        this.loading = !this.loading;
      })
    );
  }

  formatDate(date) {
    // tslint:disable-next-line:prefer-const
    let d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        // tslint:disable-next-line:prefer-const
        year = d.getFullYear();

    // tslint:disable-next-line:curly
    if (month.length < 2) month = '0' + month;
    // tslint:disable-next-line:curly
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

  trackByFn(index, item) {
    return index;
  }

}
