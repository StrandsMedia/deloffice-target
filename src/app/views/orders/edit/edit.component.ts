import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CustomerService } from '../../../common/services/customer.service';
import { OrdersService } from '../../../common/services/orders.service';
import { MaterialService } from 'src/app/common/services/material.service';

import { Observable, of, fromEvent, BehaviorSubject } from 'rxjs';
import { tap, debounceTime, switchMap, map } from 'rxjs/operators';
import { ProductService } from 'src/app/common/services/product.service';
import { renderInvoice } from '../orders.utils';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  dataSource$: Observable<any>;
  product$: Observable<any>;
  loading = false;
  view = true;

  entries = [];
  private _prodEntr$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public prodEnt$: Observable<any> = this._prodEntr$.asObservable();
  public tempProd: any;

  private _tempData: any;
  stable = [];

  postData: any = {};

  filteredResults: Observable<any>;
  public columns = [
    'p_id',
    'des',
    'brand',
    'stock',
    'qty',
    'defprice',
    'pricecat',
    'invprice',
    'totalexcl',
    'vat',
    'totalincl',
    'edit',
    'sprice',
    'cprice',
    'uprofit',
    'tprofit',
    'pprofit'
  ];

  public searchForm = this._fb.group({
    company_name: null
  });

  public searchProdForm: FormGroup = this._fb.group({
    cust_id: [null, Validators.required],
    prodsearch: null
  });

  public addProdForm: FormGroup = this._fb.group({
    p_id: null,
    StockLink: null,
    Description_1: null,
    Description_2: null,
    Description_3: null,
    Qty_On_Hand: null,
    fExclPrice: null,
    fExclPrice2: null,
    qty: null,
    AveUCst: null,
    TaxRate: null,
    idTaxRate: null,
    status: null,
    pricecat: null
  });

  constructor(
    private _cust: CustomerService,
    private _fb: FormBuilder,
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _prod: ProductService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.loading = true;
    this.dataSource$ = this._route.params.pipe(
      map(params => params.id),
      switchMap(params => {
        return this._order.getInvoice(+params);
      }),
      map((res: any) => res.records[0]),
      tap((res) => {
        console.log(res);
        this._tempData = res;
        this.searchProdForm.controls['cust_id'].setValue(res.cust_id);
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

  searchProd() {
    this.product$ = this._prod.searchAdv(this.searchProdForm.value).pipe(
      map((res: any) => res.records)
    );
  }

  resetDoc() {
    console.log(this.stable);
    this.entries = this.stable;
  }

  removeFromList(index) {
    const entries = this._prodEntr$.value;
    const entryStatus = entries[index]['status'];

    switch (entryStatus) {
      case 'existing':
        entries[index]['status'] = 'delete';
        break;
      case 'new':
        entries.splice(index, 1);
        break;
      default:
        entries[index]['status'] = 'existing';
    }

    this._prodEntr$.next(entries);
  }

  toggleView() {
    this.view = !this.view;
  }

  updateVal(index, event) {
    const entries = this._prodEntr$.value;
    let newval = event.target.value;
    const field = event.target.id;
    if (field === 'fExclPrice') {
      newval = parseFloat(newval).toFixed(2);
    }
    entries[index][field] = newval;

    this._prodEntr$.next(entries);
  }

  addToTemp() {
    const tempArray = this._prodEntr$.value;

    if (!this._isInArr()) {
      this.tempProd.qty = 1;
      this.tempProd.fExclPrice2 = this.tempProd.fExclPrice;
      this.tempProd.status = 'existing';
      tempArray.unshift(this.tempProd);

      this._prodEntr$.next(tempArray);
    } else {
      alert('Product already exists in document');
    }

    this.tempProd = null;
  }

  // Utils

  private _isInArr(): boolean {
    const tempArray: any[] = this._prodEntr$.value;
    return tempArray.reduce((acc, curr) => {
      if (curr.p_id == this.tempProd.p_id) {
        return true;
      } else {
        return false;
      }
    }, false);
  }

  public totalexcl() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + (+curr.fExclPrice * +curr.qty), 0);
  }

  public totalvat() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + ((+curr.fExclPrice * 0.15) * +curr.qty), 0);
  }

  public totalincl() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + ((+curr.fExclPrice * (0.15 + 1)) * +curr.qty), 0);
  }

  public totalprofit() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + ((+curr.fExclPrice - +curr.AveUCst) * +curr.qty), 0);
  }

  public get arrLength(): number {
    const prodArr = this._prodEntr$.value;
    return prodArr.length;
  }

  // PDF Utils

  viewPDF() {
    console.log(this._tempData);
    const pdf = renderInvoice(this._tempData);
    pdf.output('dataurlnewwindow', { filename: 'newpdf.pdf' });
  }

}
