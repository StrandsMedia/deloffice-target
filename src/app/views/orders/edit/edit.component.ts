import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CustomerService } from '../../../common/services/customer.service';
import { OrdersService } from '../../../common/services/orders.service';
import { MaterialService } from 'src/app/common/services/material.service';

import { Observable, of, fromEvent, BehaviorSubject } from 'rxjs';
import { tap, debounceTime, switchMap, map } from 'rxjs/operators';
import { ProductService } from 'src/app/common/services/product.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  dataSource$: Observable<any>;
  prodResults: Observable<any>;
  loading = false;
  view = true;
  totalexcl;
  totalprofit;
  vat;
  totalincl;

  entries = [];
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
        this.searchProdForm.controls['cust_id'].setValue(res.cust_id);
        this.entries = res.entries;

        this.stable = Array.from(this.entries);

        this.entries.forEach(entry => {
          entry.status = 'existing';
        });

        console.log(this.searchProdForm.value);
        this.calculateTotals(this.entries);
        this.loading = !this.loading;
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  searchProd() {
    this.prodResults = this._prod.searchAdv(this.searchProdForm.value).pipe(
      (res: any) => res.records
    );
  }

  resetDoc() {
    console.log(this.stable);
    this.entries = this.stable;
  }

  removeFromList(index) {
    const entryStatus = this.entries[index]['status'];

    switch (entryStatus) {
      case 'existing':
        this.entries[index]['status'] = 'delete';
        break;
      case 'new':
        this.entries.splice(index, 1);
        break;
      default:
        this.entries[index]['status'] = 'existing';
    }
  }

  toggleView() {
    this.view = !this.view;
  }

  updateVal(index, event) {
    let newval = event.target.value;
    const field = event.target.id;
    if (field === 'fExclPrice') {
      newval = parseFloat(newval).toFixed(2);
    }
    this.entries[index][field] = newval;

    this.calculateTotals(this.entries);
  }

  calculateTotals(data: any[]) {
    this.totalexcl = data.reduce((acc,  cur) => acc + (+cur.fExclPrice * +cur.qty), 0);
    this.vat = data.reduce((acc,  cur) => acc + ((+cur.fExclPrice * 0.15) * +cur.qty), 0);
    this.totalincl = this.totalexcl + this.vat;
    this.totalprofit = data.reduce((acc, cur) => acc + ((+cur.fExclPrice - +cur.AveUCst) * +cur.qty), 0);
  }

}
