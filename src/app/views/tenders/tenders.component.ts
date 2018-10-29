import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TendersService } from '../../common/services/tenders.service';

import { Observable, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
  dataSource$: Observable<any>;
  loading = false;
  choice = 'status';
  columns = [
    'company_name',
    'product',
    'estqty',
    'schedule',
    'received',
    'closing',
    'actqty',
    'delivery',
    'productquoted',
    'price',
    'attachment',
    'result',
    'comments',
    'edit'
  ];

  public searchForm = this.fb.group({
    status: 0,
    company_name: [''],
  });

  constructor(private fb: FormBuilder, private tender: TendersService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    if (this.choice === 'status') {
      this.searchForm.value.company_name = null;
    } else if (this.choice === 'customer') {
      this.searchForm.value.status = null;
    }
    this.loading = true;
    return this.dataSource$ = this.tender.getTenders(this.searchForm.value).pipe(
      map(tenders => tenders.records),
      delay(500),
      tap((e) => {
        this.loading = !this.loading;
      })
    );
  }

}
