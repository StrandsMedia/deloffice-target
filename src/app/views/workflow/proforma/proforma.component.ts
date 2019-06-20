import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../common/services/auth.service';
import { MaterialService } from '../../../common/services/material.service';
import { OrdersService } from '../../../common/services/orders.service';
import { WorkflowService } from '../../../common/services/workflow.service';
import { QuestionControlService } from '../popup/utils/question-control.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-proforma',
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss']
})
export class ProformaComponent implements OnInit {
  public dataSource$: Observable<any>;
  public asc = true;
  public loading = false;
  clicked = 0;
  sortKey: any;
  public columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'orderconfirm',
    'profinprocess',
    'proftobeamended',
    'proftobecancelled',
    'creditcontrol',
    'profprocessed',
    'duration'
  ];

  public user: any;

  public searchForm: FormGroup = this.fb.group({
    searchInput: ['']
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private order: OrdersService,
    private wf: WorkflowService,
    private qcs: QuestionControlService,
    private _router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.auth.currentUser.subscribe(data => this.user = data);
   }

  ngOnInit(): void {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.getWorkflow(2).pipe(
      map((data: any) => {
        return data.records;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  filter() {}

  sortObs(key, direction) {
    let dir;
    direction ? dir = 'asc' : dir = 'desc';
    return this.dataSource$ = this.wf.getWorkflow(2).pipe(
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
          // this.get();
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

  public createDocument(row) {
    const object = {
      company_name: row.company_name,
      customerCode: row.customerCode,
      workflow_id: row.workflow_id,
      user: this.user.user_id
    };
    console.log(object);
    this.order.createInvoice(object)
      .pipe(
        tap(id => {
          this._router.navigate(['/order-entry/view/' + id]);
        })
      ).subscribe();
  }

}
