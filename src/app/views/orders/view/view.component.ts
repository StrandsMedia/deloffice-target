import { Component, OnInit, OnDestroy } from '@angular/core';

import { MaterialService } from '../../../common/services/material.service';
import { OrdersService } from '../../../common/services/orders.service';
import { renderInvoice } from '../orders.utils';

import { timer, Observable, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  private _notifier: Subject<boolean> = new Subject<boolean>();

  dataSource$: Observable<any>;
  state: States = 1;
  tabbar: any;
  loading = false;
  columns = [
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
  info: any;

  constructor(private mdc: MaterialService, private order: OrdersService) { }

  ngOnInit() {
    this.initTab();
    this.get();
  }

  ngOnDestroy() {
    this._notifier.next(true);
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.order.getInvoices(this.state).pipe(
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
      }),
      takeUntil(this._notifier)
    ).subscribe(() => this.get());
  }

  renderPDF(inv) {
    const pdf = renderInvoice(inv);
    pdf.save('proforma_inv.pdf');
  }

  loadInfo(row) {
    this.info = row;
  }

}

export type States = 1 | 2 | 3 | 4 | 5 | 6;

