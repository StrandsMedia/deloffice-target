import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-goods-prep',
  templateUrl: './goods-prep.component.html',
  styleUrls: ['./goods-prep.component.scss']
})
export class GoodsPrepComponent implements OnInit {
  public dataSource$: Observable<any>;
  public asc = true;
  clicked = 0;
  sortKey: any;
  public loading = false;
  public hasClass = false;
  formData: any;
  public user: any;

  public columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'company',
    'goodstbprep',
    'goodsinprep',
    'amend',
    // 'transfer',
    // 'purchase',
    'goodstbchecked',
    'goodsreadytbi',
    'duration'
  ];

  public searchForm: FormGroup = this.fb.group({
    searchInput: ['']
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private wf: WorkflowService
  ) { 
    this.auth.currentUser.subscribe(data => this.user = data);
   }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.getWorkflow(3).pipe(
      map((data: any) => {
        return data.records;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  sortObs(key, direction) {
    let dir;
    direction ? dir = 'asc' : dir = 'desc';
    return this.dataSource$ = this.wf.getWorkflow(3).pipe(
      map((data: any) => data.records),
      map((records) => {
        return records.sort((a, b) => {
          // tslint:disable-next-line:curly
          if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
          // tslint:disable-next-line:curly
          if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
          return 0;
        });
      })
    );
  }

  sort($event) {
    let sortKey = '';
    switch (this.clicked) {
      case 0:
        sortKey = $event.target.getAttribute('data-name');
        this.sortObs(sortKey, this.asc);
        this.sortKey = sortKey;
        this.clicked++;
        break;
      case 1:
        sortKey = $event.target.getAttribute('data-name');
        if (this.sortKey === sortKey) {
          this.sortObs(sortKey, !this.asc);
          this.clicked++;
        } else {
          this.sortObs(sortKey, this.asc);
          this.clicked = 1;
        }
        this.sortKey = sortKey;
        break;
      case 2:
        sortKey = $event.target.getAttribute('data-name');
        if (this.sortKey === sortKey) {
          this.get();
          this.sortKey = '';
          this.clicked = 0;
        } else {
          this.sortObs(sortKey, this.asc);
          this.sortKey = sortKey;
          this.clicked = 1;
        }
        break;
    }
  }

  filter() {
    const q: string = (this.searchForm.value.searchInput).toLowerCase();
    return this.dataSource$ = this.wf.getWorkflow(3).pipe(
      map((data: any) => data.records),
      map(records => {
        return records.filter((record) => {
          const name = record['company_name'].toLowerCase() as any;
          return name.includes(q);
        });
      })
    );
  }
}
