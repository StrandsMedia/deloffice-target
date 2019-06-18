import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AuthService } from '../../common/services/auth.service';
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
  click = 0;
  user: any;
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
    { id: 'Booklet', name: 'Booklet' },
    { id: 'Other', name: 'Other' },
  ];

  printwork = [
    { id: 'rectoQuad', name: 'Recto Quad' },
    { id: 'rectoBlack', name: 'Recto Black' },
    { id: 'versoBlack', name: 'Verso Black' },
    { id: 'versoQuad', name: 'Verso Quad' },
    { id: 'Recto/Verso Quad', name: 'Recto/Verso Quad' },
    { id: 'Recto/Verso Black', name: 'Recto/Verso Black' }
  ];

  printedit: any;

  public searchForm = this.fb.group({
    status: 0,
    company_name: [''],
    product: ['']
  });

  public printEditForm = this.fb.group({
    job_id: null,
    custid: null,
    product: null,
    printwork: null,
    startdate: null,
    enddate: null,
    status: null,
    jobdesc: null,
    paperspecs: null,
    filename: null,
    pc: null,
    printer: null,
    printsetting: null,
    qtyorder: null,
    qtyconsumed: null,
    qtycompleted: null,
    qtyrejected: null,
    remarks: null,
    printedby: null,
    supervisedby: null,
    deliverydate: null,
    dimensions: null,
    ppunit: null,
    company_name: null
  });

  constructor(private auth: AuthService, private fb: FormBuilder, private print: PrintingService) {
    this.auth.currentUser.subscribe(user => this.user = user);
  }

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

  update() {
    this.loading = true;
    this.print.updatePrinting(this.printEditForm.value).subscribe(() => this.get());
  }

  trackByFn(index, item) {
    return index;
  }

  incrClick() {
    this.click++;
  }

  remainingAmt(row) {
    if (row['qtyorder'] && row['qtyconsumed'] && row['qtyrejected']) {
      const amt = (row['qtyorder'] - (row['qtyconsumed'] - row['qtyrejected']));
      return amt === 0 ? 'None' : amt;
    }
    return '-';
  }

  remainingAmtAlt(row) {
    if (row['qtyorder'] && row['qtycompleted']) {
      const amt = (+row['qtyorder'] - +row['qtycompleted']);
      return amt === 0 ? 'None' : amt;
    }
    return '-';
  }

  getPercentage(row) {
    if (row['qtyrejected'] && row['qtyconsumed']) {
      const amt = (+row['qtyrejected'] / +row['qtyconsumed']);
      return amt;
    }
    return null;
  }

  editPrint(row) {
    this.printEditForm.setValue(row);
  }

}
