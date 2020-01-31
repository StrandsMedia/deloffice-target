import { Component, OnInit } from '@angular/core';

import { MaterialService } from '../../common/services/material.service';
import { OrdersService } from '../../common/services/orders.service';
import { PurgatoryService } from '../../common/services/purgatory.service';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-purgatory',
  templateUrl: './purgatory.component.html',
  styleUrls: ['./purgatory.component.scss']
})
export class PurgatoryComponent implements OnInit {
  public loading: boolean;
  public purgatoryData$: Observable<any>;
  public prodData$: Observable<any>;

  public selectedProdData: any;
  public selectedItem: any;

  public selectedType = 1;
  public selectedMode = 1;

  public columnrequest = [
    'no',
    'name',
    'code',
    'des',
    'brand',
    'qty',
    'btn'
  ];

  constructor(
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _purgatory: PurgatoryService
  ) { }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.purgatoryData$ = this._purgatory.getPurchasingData(this.selectedType, this.selectedMode).pipe(
      map(data => {
        if (this.selectedType == 1 || this.selectedType == 5 || this.selectedType == 4) {
          return data.requests;
        } else {
          return data;
        }
        
      })
    )
  }

  addStock(arr: any) {
    const requests: any[] = arr.stock;
    arr.stock = [{
      workflow_id: null,
      company_name: 'Stock',
      qty: 1,
      completed: 1
    }];
  }

  public getTotal(data: any) {
    const total1 = (data.requests as any[]).reduce((acc, curr) => acc + +curr.qty, 0);
    const total2 = data.stock ? (data.stock as any[]).reduce((acc, curr) => acc + +curr.qty, 0) : 0;
    return total1 + total2;
  }

  public get mode(): string {
    switch(+this.selectedMode) {
      case 1:
        return 'Purchase';
      case 2:
        return 'Transfer';
      default:
        return 'Purchase';
    }
  }

  public trackByFn(index, item) {
    return index;
  }

  public stockLeft(data: any) {
    const allocated = (data.reqs as any[]).reduce((acc, curr) => acc + +curr.qty, 0);
    return +data.qty - allocated;
  }

  public assignProd(type: number = 2) {
    this.prodData$ = this._purgatory.getPurchasingProduct(this.selectedProdData.p_id, type);
  }

  handlePurchase() {
    const obj = {
      type: this.selectedMode + 1,
      req_id: this.selectedItem.req_id,
      status: +this.selectedItem.completed + 1,
      invlineid: this.selectedItem.invlineid
    };

    console.log(obj);

    this._purgatory.amendPurchase(obj)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        // this.assignProd();
        this.get();
        this.selectedItem = null;
      }
    );
  }

  handlePurchase2(choice) {
    const obj = {
      type: this.selectedMode + 1,
      req_id: this.selectedItem.req_id,
      status: +choice + 1,
      invlineid: this.selectedItem.invlineid
    };

    console.log(obj);

    this._purgatory.amendPurchase(obj)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        // this.assignProd();
        this.selectedItem = null;
        this.get();
      }
    );
  }
}
