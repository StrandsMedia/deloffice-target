import { Component, OnInit } from '@angular/core';

import { MaterialService } from '../../../common/services/material.service';
import { OrdersService } from '../../../common/services/orders.service';

import { timer, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  dataSource$: Observable<any>;
  state: States = 1;
  tabbar: any;
  loading = false;
  columns: [
    'tempid',
    'wfid',
    'date',
    'customer',
    'itemcount',
    'poref',
    'invno',
    'total',
    'notes',
    'user',
    'edit'
  ];

  constructor(private mdc: MaterialService, private order: OrdersService) { }

  ngOnInit() {
    this.initTab();
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.order.getInvoices(this.state).pipe(
      tap((docs) => console.log(docs)),
      map((docs: any) => docs.records),
      tap((v) => {
        this.loading = !this.loading;
      })
    );
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

  changeState(state: States) {
    timer(200).pipe(
      tap(v => {
        this.state = state;
      })
    ).subscribe(() => this.get());
  }

}

export type States = 1 | 2 | 3 | 4 | 5 | 6;

