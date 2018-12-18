import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CustomerService } from '../../../common/services/customer.service';
import { MaterialService } from '../../../common/services/material.service';

import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  tabstatus: Tabs = 'jobs';
  tabbar;
  total = 0;
  baltotal = 0;

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

  public editContactForm = this.fb.group({
    contact_person: null,
    email: null,
    tel: null,
    fax: null,
    mob: null,
    id: null,
    cust_id: null
  });

  constructor(
    private cust: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private mdc: MaterialService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.get();
  }

  ngAfterViewInit() {
    this.initTab();
  }

  get() {
    this.route.params.forEach((params: Params) => {
      this.customer = this.cust.getCustomer(+params['id']).pipe(
        map((data: any) => {
          if (data.customerCode) {
            this.balance = this.cust.getBalance(data.customerCode).pipe(
              map((bal) => {
                this.total = bal['records'].reduce((acc, curr) => acc + +curr.Outstanding, 0);
                return bal;
              })
            );

            this.statement = this.cust.getStatement(data.customerCode).pipe(
              map(allocs => allocs.records),
              map((allocs) => {
                this.baltotal = allocs.reduce((acc, curr) => acc + +curr.Outstanding, 0);
              })
            );
          }
          return data;
        })
      );
    });
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

  trackByFn(index, item) {
    return index;
  }

  switchData(person, id) {
    this.editContactForm.setValue({
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

  public getAmt(amt): any {
    return amt;
  }

  submit() {
    this.cust.updateDetails(this.editContactForm.value).subscribe((data) => {
      this.mdc.materialSnackBar(data);
      this.get();
    });
  }

  generateStatement() {
    
  }

}

export type Tabs = 'jobs' | 'comments' | 'pricing' | 'details' | 'allocations';

