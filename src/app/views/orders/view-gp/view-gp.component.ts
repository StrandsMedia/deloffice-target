import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { OrdersService } from '../../../common/services/orders.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-view-gp',
  templateUrl: './view-gp.component.html',
  styleUrls: ['./view-gp.component.scss']
})
export class ViewGPComponent implements OnInit {
  // Hello Coosoom ^_^ !

  // You need to use an Observable to put the data inside it
  loading = false;
  public invoice$: Observable<any>;

  entries = [];
  private _prodEntr$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public prodEnt$: Observable<any> = this._prodEntr$.asObservable();
  public tempProd: any;

  private _tempData: any;

  // You will also need columns for your table
  public columns = [
    'p_id',
    'des',
    'brand',
    'qty',
    'confirm',
    'verify'
  ];

  // public confirm: boolean;
  // public verify: boolean;

  constructor(
    private _order: OrdersService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.get();
  }

  // You need a getter function for the data
  get() {
    // Use the observable to assign it to the data from the service
    this.invoice$ = this._route.params.pipe(
      map(params => params.id),
      switchMap(params => {
        return this._order.getInvoice(+params);
      }),
      map((res: any) => res.records[0]),
      tap((res) => {
        this._tempData = res;
        //this.searchProdForm.controls['cust_id'].setValue(res.cust_id);
        this.entries = res.entries;

        this.entries.forEach(entry => {
          entry.status = 'existing';
        });

        this._prodEntr$.next(this.entries);

        this.loading = !this.loading;
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  // public toggleConfirmMode() {
  //   this.confirm = !this.confirm;
  // }

  // public toggleVerifyMode() {
  //   this.confirm = !this.confirm;
  // }
}