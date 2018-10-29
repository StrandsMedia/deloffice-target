import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomerService } from 'src/app/common/services/customer.service';
import { CategoryService } from 'src/app/common/services/category.service';
import { MaterialService } from 'src/app/common/services/material.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  dataSource$: Observable<any>;
  categories: Observable<any>;
  sectors: Observable<any>;
  subsectors: Observable<any>;
  random;
  response;
  columns = [
    'cust_id',
    'company_name',
    'contact_person',
    'contact_number',
    'notes',
    'updated',
    'operations'
  ];

  public searchForm = this.fb.group({
    search: ['']
  });

  public addForm = this.fb.group({
    customerCode: [''],
    company_name: [''],
    address: [''],
    category: [''],
    sector: [''],
    subsector: [''],
    contact_person: [''],
    email: [''],
    tel: [''],
    fax: [''],
    mob: ['']
  });

  constructor(
    private cust: CustomerService,
    private cat: CategoryService,
    private fb: FormBuilder,
    private mdc: MaterialService
  ) { }

  ngOnInit() {
    this.get();
    this.categories = this.cat.getCategory();
    this.sectors = this.cat.getSector();
    this.subsectors = this.cat.getSubsector();
  }

  get() {
    return this.dataSource$ = this.cust.getCustomers().pipe(
      map(customers => customers.records)
    );
  }

  create() {
    this.cust.addCustomer(this.addForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        //
      },
      () => {
        this.addForm.reset();
        this.get();
      });
  }

  delete(id) {
    this.cust.deleteCustomer({cust_id: id}).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        this.response = data;
      }
    );
  }

  clickHandler(e) {
    this.mdc.materialSnackBar(this.response);
    this.get();
  }

  search() {
    return this.dataSource$ = this.cust.getCustomers(this.searchForm.value.search).pipe(
      map(customers => customers.records)
    );
  }

  cancel() {
    this.addForm.reset();
  }

}
