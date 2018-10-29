import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CustomerService } from '../../../common/services/customer.service';
import { MaterialService } from '../../../common/services/material.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {
  customerdata: Subscription;
  customer: any;
  tabstatus: Tabs = 'jobs';
  tabbar;

  public tabs = [
    'Jobs',
    'Comments',
    'Pricing',
    'Details'
  ];

  constructor(
    private cust: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private mdc: MaterialService
  ) { }

  ngOnInit() {
    this.get();
    this.initTab();
  }

  ngOnDestroy() {
    this.customerdata.unsubscribe();
  }

  get() {
    return this.route.params.forEach((params: Params) => {
      this.customerdata = this.cust.getCustomer(+params['id']).subscribe((data) => {
        this.customer = data;
      });
    });
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

}

export type Tabs = 'jobs' | 'comments' | 'pricing' | 'details';

