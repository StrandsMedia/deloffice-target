import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerService } from '../../../common/services/customer.service';
import { OrdersService } from '../../../common/services/orders.service';
import { ProductService } from '../../../common/services/product.service';

import { Observable, of, fromEvent, BehaviorSubject } from 'rxjs';
import { tap, debounceTime, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AfterViewInit {
  public dataSource$: Observable<any>;
  public product$: Observable<any>;

  public tempArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public tempArr$: Observable<any> = this.tempArray.asObservable();
  public tempProd: any;

  public loading = false;
  public view = true;

  totalexcl;
  vat;
  totalincl;

  postData: any = {};

  public filteredResults: Observable<any>;
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
    prodsearch: [null, Validators.required],
    cust_id: [null, Validators.required]
  });

  constructor(
    private _cust: CustomerService,
    private _fb: FormBuilder,
    private _prod: ProductService
  ) { }

  ngOnInit() {
    // this.dataSource$ = this.arr.asObservable().pipe(
    //   tap(v => console.log(v)),
    //   map(num => {
    //     this.total = num.reduce((acc, cur) => acc + cur);
    //     return num;
    //   })
    // );
  }

  ngAfterViewInit() {
    this.searchField();
  }

  public trackByFn(index, item) {
    return index;
  }

  public search() {
    return this.filteredResults = this.searchForm.get('company_name').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this._cust.searchCust(value))
    );
  }

  public assign(res) {
    this.postData.customer = res;
    this.searchProdForm.controls['cust_id'].setValue(res.cust_id);
    this.searchForm.reset();
  }

  public unassign() {
    this.postData.customer = null;
  }

  public searchField() {
    const search = <HTMLInputElement>document.querySelector('input#compsearch');
    fromEvent(search, 'blur').subscribe(() => {
      search.placeholder = 'Enter Customer Name';
    });

    fromEvent(search, 'focus').subscribe(() => {
      search.placeholder = '';
      this.filteredResults = of([]);
    });
  }

  public toggleView() {
    this.view = !this.view;
  }

  public searchProds() {
    this.product$ = this._prod.searchAdv(this.searchProdForm.value).pipe(
      map(res => res.records)
    );
  }

  private _isInArr(): boolean {
    const tempArray: any[] = this.tempArray.value;
    return tempArray.reduce((acc, curr) => {
      if (curr.p_id == this.tempProd.p_id) {
        return true;
      } else {
        return false;
      }
    }, false);
  }

  public addToTemp(): void {
    const tempArray = this.tempArray.value;

    if (!this._isInArr()) {
      this.tempProd.qty = 1;
      this.tempProd.fExclPrice2 = this.tempProd.fExclPrice;
      tempArray.unshift(this.tempProd);

      this.tempArray.next(tempArray);
    } else {
      alert('Product already exists in document');
    }

    this.tempProd = null;
  }

  public updateQty(index, $event) {
    const tempArr = this.tempArray.value;
    if (+$event.target.value > +$event.target.max) {
      alert('Incorrect amount input. Amount exceeded quantity in stock.');
      $event.target.value = +$event.target.max;
    }
    tempArr[index].qty = +$event.target.value;

    this.tempArray.next(tempArr);
  }

  public updatePrice(index, $event) {
    const tempArr = this.tempArray.value;
    tempArr[index].fExclPrice = +$event.target.value;

    this.tempArray.next(tempArr);
  }

  public removeFromList(index) {
    const tempArr = this.tempArray.value;
    tempArr.splice(index, 1);
    this.tempArray.next(tempArr);
  }

  public get totalExcl(): number {
    const tempArr: any[] = this.tempArray.value;
    return tempArr.reduce((acc, curr) => +acc + (+curr.fExclPrice * +curr.qty), 0);
  }

  public get totalIncl(): number {
    const tempArr: any[] = this.tempArray.value;
    return tempArr.reduce((acc, curr) => +acc + ((+curr.fExclPrice * 1.15) * +curr.qty), 0);
  }

  public get totalTax(): number {
    const tempArr: any[] = this.tempArray.value;
    return tempArr.reduce((acc, curr) => +acc + ((+curr.fExclPrice * 0.15) * +curr.qty), 0);
  }

}
