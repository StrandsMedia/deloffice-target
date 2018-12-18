import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CustomerService } from '../../../common/services/customer.service';
import { OrdersService } from '../../../common/services/orders.service';

import { Observable, of, fromEvent, BehaviorSubject } from 'rxjs';
import { tap, debounceTime, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AfterViewInit {
  dataSource$: Observable<any>;
  loading = false;
  view = true;
  totalexcl;
  vat;
  totalincl;

  postData: any = {};

  filteredResults: Observable<any>;
  columns = [
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

  public searchForm = this.fb.group({
    company_name: null
  });

  constructor(
    private cust: CustomerService,
    private fb: FormBuilder
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

  trackByFn(index, item) {
    return index;
  }

  search() {
    return this.filteredResults = this.searchForm.get('company_name').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.cust.searchCust(value))
    );
  }

  assign(res) {
    this.postData.customer = res;
    this.searchForm.reset();
  }

  unassign() {
    this.postData.customer = null;
  }

  searchField() {
    const search = <HTMLInputElement>document.querySelector('input#compsearch');
    fromEvent(search, 'blur').subscribe(() => {
      search.placeholder = 'Enter Customer Name';
    });

    fromEvent(search, 'focus').subscribe(() => {
      search.placeholder = '';
      this.filteredResults = of([]);
    });
  }

  toggleView() {
    this.view = !this.view;
  }

}
