import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from 'src/app/common/services/auth.service';
import { CategoryService } from 'src/app/common/services/category.service';
import { CustomerService } from 'src/app/common/services/customer.service';
import { MaterialService } from 'src/app/common/services/material.service';
import { RoutesService } from 'src/app/common/services/routes.service';

import { Subscription, Observable, combineLatest } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { TitleService } from 'src/app/common/services/title.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, AfterViewInit {
  customerdata: Subscription;
  customer: Observable<any>;
  balance: Observable<any>;
  statement: Observable<any>;
  locations: Observable<any>;

  categories: Observable<Category>;
  sectors: Observable<Sector>;
  subsectors: Observable<Subsector>;

  tabstatus: Tabs = 'jobs';
  tabbar;
  total = 0;
  baltotal = 0;
  user: any;

  id: number;
  data: number;

  public tabs = [
    'Jobs',
    'Comments',
    'Pricing',
    'Allocations',
    'Details'
  ];

  columns = [
    'terms',
    'balance'
  ];

  terms = [
    'Current',
    '30 days',
    '60 days',
    '90 days',
    '120 days',
    '150 days',
    '180 days'
  ];

  public editContactForm = this._fb.group({
    data: null,
    contact_person: null,
    email: null,
    tel: null,
    fax: null,
    mob: null,
    id: null,
    cust_id: null
  });

  public editCustomerForm: FormGroup = this._fb.group({
    data: null,
    cust_id: [null, Validators.required],
    customerCode: null,
    company_name: [null, Validators.required],
    address: null,
    address2: null,
    address3: null,
    location: null,
    location2: null,
    location3: null,
    category: null,
    sector: [''],
    subsector: ['']
  });

  public changeTermForm: FormGroup = this._fb.group({
    term: ['', Validators.required],
    DCLink: [null, Validators.required],
    data: null
  });

  constructor(
    private _auth: AuthService,
    private _cat: CategoryService,
    private _cust: CustomerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mdc: MaterialService,
    private _fb: FormBuilder,
    private _title: TitleService,
    private _routes: RoutesService
  ) {
    _auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
    this.categories = this._cat.getCategory();
    this.sectors = this._cat.getSector();
    this.subsectors = this._cat.getSubsector();
    this.locations = this._routes.getLocation();
  }

  ngAfterViewInit() {
    this.initTab();
  }

  get() {
    this.customer = combineLatest(this._route.params, this._route.queryParams).pipe(
      switchMap(([params, queryParams]) => {
        if (queryParams['data']) {
          return this._cust.getCustomer(+params['id'], +queryParams['data']);
        } else {
          return this._cust.getCustomer(+params['id'], 1);
        }
      }),
      tap((data: any) => {
        this._title.swapTitle(data.company_name);
        this.changeTermForm.controls['data'].setValue(data.data);
        this.editCustomerForm.controls['data'].setValue(data.data);
        this.editContactForm.controls['data'].setValue(data.data);
      }),
      map((data: any) => {
        if (data.customerCode) {
          this.balance = this._cust.getBalance(data.customerCode, data.data).pipe(
            map((bal) => {
              this.total = bal['records'].reduce((acc, curr) => acc + +curr.Outstanding, 0);
              return bal;
            })
          );

          this.statement = this._cust.getStatement(data.customerCode, data.data).pipe(
            map((allocs: any) => {
              if (allocs) {
                return allocs.records;
              }
            }),
            map((allocs) => {
              if (allocs) {
                this.baltotal = allocs.reduce((acc, curr) => acc + +curr.Outstanding, 0);
              }
            })
          );
        }
        return data;
      })
    );
  }

  initTab() {
    this.tabbar = this._mdc.materialTabBar('.mdc-tab-bar');
  }

  trackByFn(index, item) {
    return index;
  }

  bindTerm(val) {
    this.changeTermForm.controls['term'].setValue(val.terms);
    this.changeTermForm.controls['DCLink'].setValue(val.DCLink);
  }

  switchData(person, id) {
    this.editContactForm.patchValue({
      contact_person: person.contact_person,
      email: person.email,
      tel: person.tel,
      fax: person.fax,
      mob: person.mob,
      id: person.id,
      cust_id: id
    });
    console.log(this.editContactForm.value);
  }

  loadProfile(customer) {
    this.editCustomerForm.patchValue({
      cust_id: customer.cust_id,
      company_name: customer.company_name,
      customerCode: customer.customerCode,
      address: customer.address,
      category: customer.category,
      sector: customer.sector,
      subsector: customer.subsector
    });
  }

  public getAmt(amt: any): string {
    if (amt === '0.0' || amt === null) {
      return '-';
    }

    if (amt < 0) {
      return `(${(Math.abs(amt)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')})`;
    }

    return Number(amt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  submit() {
    this._cust.updateDetails(this.editContactForm.value).subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

  updateProfile() {
    this._cust.updateProfile(this.editCustomerForm.value).subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.editCustomerForm.reset();
      }
    );
  }

  generateStatement() {
    //
  }

  updateTerm() {
    console.log(this.changeTermForm.value);
    this._cust.updateTerm(this.changeTermForm.value).subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

}

export type Tabs = 'jobs' | 'comments' | 'pricing' | 'details' | 'allocations';

