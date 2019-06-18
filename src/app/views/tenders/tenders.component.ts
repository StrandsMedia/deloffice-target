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

  public tenderEditForm = this.fb.group({
    tid: null,
    cust_id: null,
    product: null,
    estimated_quantity: null,
    schedule: null,
    receive_date: null,
    closing_date: null,
    actual_quantity: null,
    delivery: null,
    product_quoted: null,
    price_quoted: null,
    attachment: null,
    result: null,
    comments: null,
    status: null,
    createdAt: null,
    updatedAt: null,
    company_name: null,
    path: null
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
      map(tenders => {
        tenders.map(tndr => {
          if (tndr['schedule']) {
            tndr['schedule'] = tndr['schedule'].split(' ')[0];
          }

          if (tndr['receive_date']) {
            tndr['receive_date'] = tndr['receive_date'].split(' ')[0];
          }

          if (tndr['closing_date']) {
            tndr['closing_date'] = tndr['closing_date'].split(' ')[0];
          }
          return tndr;
        });
        return tenders;
      }),
      delay(500),
      tap((e) => {
        this.loading = !this.loading;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  loadInfo(row) {
    this.tenderEditForm.setValue(row);
  }

  editTender() {
    this.tender.updateTender(this.tenderEditForm.value).subscribe(
      (data) => console.log(data),
      (err) => console.log(err),
      () => this.get()
    );
  }

}
