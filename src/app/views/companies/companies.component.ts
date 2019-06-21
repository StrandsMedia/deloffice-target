import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  loading: boolean;
  dataSource$: Observable<any>;
  company: Observable<any>;

  columns = [
    'companyId',
    'companyName',
    'companyReference',
    'createdAt',
    'updatedAt'
  ];

  public searchForm = this.fb.group({
    company: ['']
  });

  public addForm = this.fb.group({
    companyName: null,
    companyReference: null,
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    return this.dataSource$ = this.auth.getCompany();
  }

  addNew() {
    this.auth.createCompany(this.addForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.get();
      }
    );
  }
}