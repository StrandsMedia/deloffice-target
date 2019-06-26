import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Params } from '@angular/router';

import { OrdersService } from '../../../common/services/orders.service';
import { MaterialService } from '../../../common/services/material.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-view-gp',
  templateUrl: './view-gp.component.html',
  styleUrls: ['./view-gp.component.scss']
})
export class ViewGPComponent implements OnInit {
  loading = true;
  public invoice$: Observable<any>;

  entries = [];
  private _prodEntr$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public prodEnt$: Observable<any> = this._prodEntr$.asObservable();
  public tempProd: any;

  private _tempData: any;

  public columns = [
    'p_id',
    'des',
    'brand',
    'qty',
    'confirm',
    'verify'
  ];

  public confirm: boolean = true;
  public verify: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.get();
    this.invoice$ = this.invoice$.pipe(
      tap((res) => {
        const condition = (res.entries as any[]).every(item => item.checked == 1);
        console.log(condition);

        if (!condition) {
          this.confirm = true;
          this.verify = false;
        } else {
          this.confirm = false;
          this.verify = true;
        }
      })
    );
  }

  get() {
    return this.invoice$ = this._route.params.pipe(
      map(params => params.id),
      switchMap(params => {
        return this._order.getInvoice(+params);
      }),
      map((res: any) => res.records[0]),
      tap((res) => {
        this._tempData = res;
        
        this._prodEntr$.next(res.entries);
        this.loading = !this.loading;
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  public markChecked(id) {
    this._order.markChecked(id)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    )
  }

  public markVerified(id) {
    this._order.markVerified(id)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    )
  }
}