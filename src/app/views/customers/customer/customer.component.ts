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

  public editContactForm = this.fb.group({
    contact_person: null,
    email: null,
    tel: null,
    fax: null,
    mob: null,
    id: null,
    cust_id: null
  });

  public editCustomerForm: FormGroup = this.fb.group({
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

  public changeTermForm: FormGroup = this.fb.group({
    term: ['', Validators.required],
    DCLink: [null, Validators.required],
  });

  constructor(
    private auth: AuthService,
    private cat: CategoryService,
    private cust: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private mdc: MaterialService,
    private fb: FormBuilder,
    private title: TitleService,
    private routes: RoutesService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
    this.categories = this.cat.getCategory();
    this.sectors = this.cat.getSector();
    this.subsectors = this.cat.getSubsector();
    this.locations = this.routes.getLocation();
  }

  ngAfterViewInit() {
    this.initTab();
  }

  get() {
    this.customer = combineLatest(this.route.params, this.route.queryParams).pipe(
      switchMap(([params, queryParams]) => {
        return this.cust.getCustomer(+params['id'], +queryParams['data']);
      }),
      tap((data: any) => {
        this.title.swapTitle(data.company_name);
      }),
      map((data: any) => {
        if (data.customerCode) {
          this.balance = this.cust.getBalance(data.customerCode).pipe(
            map((bal) => {
              this.total = bal['records'].reduce((acc, curr) => acc + +curr.Outstanding, 0);
              return bal;
            })
          );

          this.statement = this.cust.getStatement(data.customerCode).pipe(
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
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
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
    this.cust.updateDetails(this.editContactForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

  updateProfile() {
    this.cust.updateProfile(this.editCustomerForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
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
    this.cust.updateTerm(this.changeTermForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

}

export type Tabs = 'jobs' | 'comments' | 'pricing' | 'details' | 'allocations';

