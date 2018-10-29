import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PrintingService } from '../../common/services/printing.service';

import { Observable, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.scss']
})
export class PrintingComponent implements OnInit {
  dataSource$: Observable<any>;
  loading = false;
  choice = 'status';
  columns = [
    'jobid',
    'company_name',
    'product',
    'paperspecs',
    'ppunit',
    'qtyordered',
    'qtyconsumed',
    'qtyleft',
    'qtyrejected',
    'percentwaste',
    'startdate',
    'enddate',
    'edit'
  ];

  prodtype = [
    { id: 'Env', name: 'Envelopes' },
    { id: 'BC', name: 'Business Card' },
    { id: 'LH', name: 'Letterhead' },
    { id: 'CC', name: 'Complimentary Card' },
    { id: 'Brochure', name: 'Brochure' },
    { id: 'Memopad', name: 'Memopad' },
    { id: 'Folder', name: 'Folder' },
    { id: 'Flyer', name: 'Flyer' },
    { id: 'Leaflet', name: 'Leaflet' },
    { id: 'Forms', name: 'Forms' },
    { id: 'Stickers', name: 'Stickers' },
    { id: 'Certificate', name: 'Certificate' },
    { id: 'Voucher', name: 'Voucher' },
    { id: 'Poster', name: 'Poster' },
    { id: 'Other', name: 'Other' },
  ];

  public searchForm = this.fb.group({
    status: 0,
    company_name: [''],
    product: ['']
  });

  constructor(private fb: FormBuilder, private print: PrintingService) { }

  ngOnInit() {
    this.get();
  }

  get() {
    if (this.choice === 'status') {
      this.searchForm.value.company_name = null;
      this.searchForm.value.product = null;
    } else if (this.choice === 'customer') {
      this.searchForm.value.status = null;
      this.searchForm.value.product = null;
    } else {
      this.searchForm.value.status = null;
      this.searchForm.value.company_name = null;
    }
    this.loading = true;
    return this.dataSource$ = this.print.getPrinting(this.searchForm.value).pipe(
      map(printing => printing.records),
      delay(500),
      tap((e) => {
        this.loading = !this.loading;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  remainingAmt(row) {
    const amt = (row['qtyorder'] - (row['qtyconsumed'] - row['qtyrejected']));
    return amt === 0 ? 'None' : amt;
  }

  remainingAmtAlt(row) {
    const amt = (+row['qtyorder'] - +row['qtycompleted']);
    return amt === 0 ? 'None' : amt;
  }

  getPercentage(row) {
    const amt = (+row['qtyrejected'] / +row['qtyconsumed']);
    return amt;
  }

}
