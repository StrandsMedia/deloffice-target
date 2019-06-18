import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomerService } from 'src/app/common/services/customer.service';
import { chunkArray, image, statementLH, convertDate2, convertDateAlt, statementFT } from 'src/app/common/interfaces/letterhead';
import { renderPDF } from '../statement';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-allocs',
  templateUrl: './allocs.component.html',
  styleUrls: ['./allocs.component.scss']
})
export class AllocsComponent implements OnInit, DoCheck {
  loading: boolean;
  who: string;
  allocs: Observable<any>;
  reverseallocs: Observable<any>;
  statement: Observable<any>;

  custinfo: any;
  total = 0;

  baltotal = 0;

  status = 'Not Ready';

  customerResults: Observable<any>;

  columns = [
    { id: 'code', name: 'Code', width: '12%' },
    { id: 'date', name: 'Date', width: '13%' },
    { id: 'ref', name: 'Ref.', width: '20%' },
    { id: 'des', name: 'Descrip.', width: '25%' },
    { id: 'debit', name: 'DR', width: '10%' },
    { id: 'credit', name: 'CR', width: '10%' },
    { id: 'out', name: 'Outstd', width: '10%' }
  ];

  public searchForm = this.fb.group({
    search: [''],
    data: 1
  });

  public sendMail = this.fb.group({
    email: null,
    subject: null,
    message: null,
    attachment: null
  });

  constructor(
    private cust: CustomerService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.custinfo) {

    }
  }

  search() {
    return this.customerResults = of(true).pipe(
      debounceTime(2000),
      switchMap((v) => {
        return this.cust.searchCust(this.searchForm.value.search, this.searchForm.value.data);
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  loadAlloc(cust) {
    this.loading = true;
    this.who = `(${cust.customerCode}) - ${cust.company_name}`;
    this.custinfo = cust;
    this.allocs = this.cust.getAllocs(cust.customerCode, this.searchForm.value.data).pipe(
      tap((v) => this.loading = false)
    );
    setTimeout(() => {
      this.searchForm.value.search = '';
    }, 300);
  }

  loadInfo() {
    this.status = 'Not Ready';
    this.statement = this.cust.getStatement(this.custinfo.customerCode, this.searchForm.value.data).pipe(
      map(allocs => {
        allocs['records'].reduce((acc, curr) => {
          return curr['cum'] = +acc + +curr.Outstanding, this.total = +acc + +curr.Outstanding;
        }, 0);
        return allocs;
      }),
      map(allocs => {
        this.baltotal = allocs['balance'].reduce((acc, curr) => acc + +curr.Outstanding, 0);
        return allocs;
      }),
      tap((v) => this.status = 'Ready')
    );
  }

  savePDF() {
    const cust = this.custinfo;
    const custCode = cust.customerCode;
    const pdf = renderPDF(this.custinfo, this.total);
    pdf.save(`SOA_${custCode}_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`);
  }

  sendPDF() {
    const cust = this.custinfo;
    const custCode = cust.customerCode;
    const object = {
      mailOptions: {}
    };
    object.mailOptions = {
      from: `"Noreply DelOffice" <noreply@deloffice.mu>`,
      to: this.sendMail.value.email,
      cc: `"Accounts DelOffice" <accounts@deloffice.mu>`,
      replyTo: `"Accounts DelOffice" <accounts@deloffice.mu>`,
      subject: this.sendMail.value.subject,
      text: this.sendMail.value.message,
      attachments: [
        {
          filename: `stmt_${custCode}_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`,
          content: (renderPDF(this.custinfo).output('datauristring')).split(',')[1],
          encoding: 'base64'
        }
      ],
      priority: 'high'
    };
    console.log(object);

    this.cust.sendStatement(object).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        //
      }
    );

  }

  public constantCheck(val: Array<any>) {
    if (val.length > 0) {
      this.status = 'Ready';
    } else {
      this.status = 'Not Ready';
    }
  }

}
