import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomerService } from 'src/app/common/services/customer.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, map, tap } from 'rxjs/operators';
import { chunkArray, image, statementLH, convertDate2, convertDateAlt } from 'src/app/common/interfaces/letterhead';

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
    search: ['']
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
        return this.cust.searchCust(this.searchForm.value.search);
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
    this.allocs = this.cust.getAllocs(cust.customerCode).pipe(
      map(allocs => allocs.records)
    );
    this.reverseallocs = this.cust.getReverseAllocs(cust.customerCode).pipe(
      map(allocs => allocs.records),
      tap((v) => this.loading = false)
    );
    setTimeout(() => {
      this.searchForm.value.search = '';
    }, 300);
  }

  loadInfo() {
    this.status = 'Not Ready';
    this.statement = this.cust.getStatement(this.custinfo.customerCode).pipe(
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

  renderPDF() {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const statementtable = <HTMLTableElement>document.getElementById('statementtable');
    const baltable = <HTMLTableElement>document.getElementById('baltable');

    const stateres = pdf.autoTableHtmlToJson(statementtable, true);
    const balres = pdf.autoTableHtmlToJson(baltable, true);

    const result = chunkArray(stateres.rows, 20);
    const width = pdf.internal.pageSize.getWidth() - 15;

    const totalPagesExp = '{total_pages_count_string}';
    const total = Number(this.total.toFixed(2));
    const cust = this.custinfo;
    for (let i = 0; i < result.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      pdf.autoTable(stateres.columns, result[i], {
        theme: 'grid',
        styles: {
          fontSize: 7.5,
          overflow: 'linebreak',
          lineColor: 100,
          lineWidth: 0,
          textColor: 0,
          valign: 'top',
          halign: 'left'
        },
        columnStyles: {
          0: {
            halign: 'left',
            columnWidth: 55
          },
          1: {
            halign: 'left',
            columnWidth: 45
          },
          2: {
            halign: 'left',
            columnWidth: 95
          },
          3: {
            halign: 'left',
            columnWidth: 175
          },
          4: {
            halign: 'center',
            columnWidth: 48
          },
          5: {
            halign: 'center',
            columnWidth: 48
          },
          6: {
            halign: 'center',
            columnWidth: 48
          },
          7: {
            halign: 'center',
            columnWidth: 48
          }
        },
        headerStyles: {
          fillColor: false,
          textColor: [23, 73, 144],
          fontStyle: 'normal',
          lineWidth: 0,
          valign: 'bottom',
          fontSize: 7.5
        },
        tableWidth: 'auto',
        tableLineColor: 0,
        margin: {
          top: 227,
          left: 10,
          bottom: 85,
          right: 10,
        },
        pageBreak: 'always',
        addPageContent: function(data) {
          pdf.addImage(image, 'JPEG', 210, 22, 215, 44);
          pdf.setFontSize(8);
          pdf.setFontType('normal');
          pdf.text(statementLH.address, 210, 82);
          pdf.text(statementLH.tel, 210, 96);
          pdf.text(statementLH.vat, 210, 110);
          pdf.setFontType('bold');
          pdf.setFontSize(17.5);
          pdf.setTextColor(23, 73, 144);
          pdf.text(statementLH.title, 210, 135);
          pdf.setFontSize(8.8);
          pdf.setFontType('normal');
          pdf.setTextColor(0);
          pdf.text(`As at ${convertDate2()}`, 250, 155);
          pdf.text(cust.company_name, 15, 170);
          pdf.text(cust.Physical1, 15, 185);
          pdf.text(cust.Physical2, 15, 200);
          pdf.text(cust.Physical3, 15, 215);
          pdf.text(`VAT No : ${cust.Tax_Number}`, 250, 185);
          pdf.text(`B.R.No : ${cust.Registration}`, 250, 200);
          pdf.text(`Customer Code: ${cust.customerCode}`, 450, 170);
          pdf.text(`Statement Date : ${convertDateAlt()}`, 450, 185);
          pdf.setFontType('bold');
          pdf.text(`Amount Due (Rs) : ${total.toLocaleString()}`, 450, 200);

          // pdf.text(`Page ${i + 1} of ` + totalPagesExp, 460, 170);

          pdf.setLineWidth(1);
          pdf.line(15, 255, width, 255);
        }
      });
      pdf.autoTable(balres.columns, balres.rows, {
        theme: 'grid',
        styles: {
          fontSize: 8,
          overflow: 'linebreak',
          lineColor: 100,
          lineWidth: 1,
          textColor: 0,
          valign: 'top',
          halign: 'center'
        },
        columnStyles: {
          0: {
            halign: 'center'
          },
          1: {
            halign: 'center'
          },
          2: {
            halign: 'center'
          },
          3: {
            halign: 'center'
          },
          4: {
            halign: 'center'
          },
          5: {
            halign: 'center'
          },
          6: {
            halign: 'center'
          },
        },
        headerStyles: {
          fillColor: false,
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0,
          valign: 'bottom',
          fontSize: 8
        },
        tableWidth: 'auto',
        tableLineColor: 0,
        margin: {
          top: 690,
          left: 10,
          bottom: 85,
          right: 10,
        },
        pageBreak: 'always',
        addPageContent: function(data) {
          pdf.setFontSize(7.8);
          pdf.setFontType('bold');
          pdf.text('Terms And Conditions', 15, 745);
          pdf.setFontType('normal');
          pdf.text('(1) Invoice is due for payment 30 days as from the date of invoice', 15, 760);
          pdf.text('(2) Cheques to be drawn in favour of DelOffice Ltd and Invoice Number to be quoted', 15, 772);
          // tslint:disable-next-line:max-line-length
          pdf.text('(3) Charges on this invoice should be verified and queries should be made within 10 days from date of issue else invoice will be considered as final', 15, 784);
          pdf.text('(4) Interest at the rate of 1.5% per month will be charged on overdue accounts', 15, 796);
          // tslint:disable-next-line:max-line-length
          pdf.text('(5) In case of recovery through a solicitor, all fees, charges and commission, not exceeding 10% of amount due, are payable by the client', 15, 808);
          pdf.text('(6) Only the original receipt, issued by DelOffice Ltd, will be accepted as proof of payment.', 15, 820);
          pdf.text('(7) Any query should be addressed to our Credit Control Dept. on 249 32 00', 15, 832);
        }
      });
    }

    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }

    if (statementtable && baltable) {
      pdf.save('proforma_inv.pdf');
    }
  }

  public constantCheck(val: Array<any>) {
    if (val.length > 0) {
      this.status = 'Ready';
    } else {
      this.status = 'Not Ready';
    }
  }

}
