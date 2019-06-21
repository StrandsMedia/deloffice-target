import { Component, OnInit, AfterViewInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, NavigationEnd, Router } from '@angular/router';

import { AuthService } from '../../../common/services/auth.service';
import { CustomerService } from '../../../common/services/customer.service';
import { DebtorsService } from '../../../common/services/debtors.service';
import { MaterialService } from '../../../common/services/material.service';

import { Message, signature } from './reminder.messages';

import {
  chunkArray, image, statementLH, convertDate, convertDate2, convertDateAlt, tableToJSON, dada, statementFT
} from '../../../common/interfaces/letterhead';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Observable, of } from 'rxjs';
import { map, tap, switchMap, catchError, filter } from 'rxjs/operators';
import { presenceChecker, rempresenceChecker } from '../../../common/utils/unique.validator';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit, AfterViewInit, DoCheck {
  today = new Date();
  tabbar: any;
  tabselect = 0;
  id: any;
  dbt_id: any;
  toggle = false;
  error: any = null;

  dataSource$: Observable<any>;
  searchResults: Observable<any>;
  comments: Observable<any>;
  user: any;

  public tabs = [
    { id: 0, name: 'tosend', fullname: 'To Be Sent' },
    { id: 1, name: 'friend1', fullname: '1st Friendly Reminder' },
    { id: 2, name: 'friend2', fullname: '2nd Friendly Reminder' },
    { id: 3, name: 'rem1', fullname: '3rd Reminder' },
    { id: 4, name: 'rem2', fullname: '4th Reminder' },
    { id: 5, name: 'rem3', fullname: '5th Reminder' },
    { id: 6, name: 'rem48', fullname: '48hrs Notice' },
    { id: 7, name: 'court', fullname: 'Court Cases' },
  ];

  public pickCustForm = this.fb.group({
    custsearch: null,
    data: 1
  });

  public addRemForm = this.fb.group({
    cust_id: [null, Validators.required],
    company_name: [null, Validators.required],
    status: [null, Validators.required],
    sentDate: null,
    data: [null, Validators.required],
    step: null,
    amt: [null, Validators.required],
    user: [null]
  });

  public sendMail = this.fb.group({
    email: [null, Validators.required],
    subject: [null, Validators.required],
    message: [null, Validators.required],
    attachment: null
  });

  public newCmtForm = this.fb.group({
    cust_id: null,
    dbt_rem_id: null,
    user_id: null,
    username: null,
    date: dada(),
    comment: [null, Validators.required]
  });

  public updateCourtForm: FormGroup = this.fb.group({
    dbt_rem_id: [null, Validators.required],
    newDate: [null, Validators.required],
    user: [null, Validators.required]
  });

  public updatePayForm: FormGroup = this.fb.group({
    dbt_rem_id: [null, Validators.required],
    amount: [null, Validators.required],
    user: [null, Validators.required]
  });

  public updateAmtDueForm: FormGroup = this.fb.group({
    dbt_rem_id: [null, Validators.required],
    newAmt: [null, Validators.required],
    user: [null, Validators.required]
  });

  columns = [
    'customer',
    'company',
    'status',
    'amount',
    'sent',
    'comment',
    'nextcourt',
    'nextrem',
    'amtpaid',
    'actions'
  ];
  stat: string;
  statement: Observable<any>;
  total: number;
  baltotal: any;
  row: any;
  data: any;

  overrideTab = null;

  constructor(
    private auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private cust: CustomerService,
    private dbt: DebtorsService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    auth.currentUser.subscribe((data) => this.user = data);
  }

  ngOnInit(): void {
    this.get();
    this.route.queryParams.pipe(
      filter(params => params.status)
    ).subscribe(params => {
      this.tabselect = params.status;
      this.get();
    });
  }

  ngAfterViewInit() {
    this.initTab();
  }

  ngDoCheck() {
    this.addRemForm.controls['cust_id'].setAsyncValidators([
      presenceChecker(this.dbt, this.pickCustForm.value.data),
      rempresenceChecker(this.dbt, this.pickCustForm.value.data),
    ]);
  }

  get custid(): any {
    return this.addRemForm.get('cust_id');
  }

  public trackByFn(index, item) {
    return index;
  }

  selectTab($event) {
    const selected = $event.target.options[$event.target.options.selectedIndex];
    const attribute = selected.getAttribute('data-tab');

    this.overrideTab = +attribute;
  }

  get() {
    this.dataSource$ = this.dbt.getReminders(this.status).pipe(
      tap((v) => {
        this.cdRef.detectChanges();
      }),
      catchError(error => of(error))
    );
  }

  getArchive() {
    this.dataSource$ = this.dbt.getArchiveReminders().pipe(
      catchError(error => of(error))
    );
  }

  public get status(): number {
    let stat;
    this.tabs.forEach(tab => {
      // tslint:disable-next-line:triple-equals
      if (tab.id == this.tabselect) {
        stat = tab.id;
      }
    });

    return Number(stat);
  }

  public get name(): string {
    let stat;
    this.tabs.forEach(tab => {
      // tslint:disable-next-line:triple-equals
      if (tab.id == this.tabselect) {
        stat = tab.id + 1;
      }
    });

    return this.tabs[stat].fullname;
  }

  toggleView() {
    this.toggle = !this.toggle;
    if (!this.toggle) {
      this.get();
    } else {
      this.getArchive();
    }
  }

  public nextDate(date) {
    const dt = new Date(date);
    dt.setDate(dt.getDate() + 7);
    return dt;
  }

  isDatePast(row) {
    const next = this.nextDate(row.sentDate);

    const t2 = this.today.getTime();
    const t1 = next.getTime();

    // tslint:disable-next-line:radix
    const diff = parseInt(`${(t2 - t1) / (24 * 3600 * 1000)}`);

    if (diff > 0) {
      return true;
    }
    return false;
  }


  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

  update2() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(event => {
        return this.route.queryParams;
      }),
      filter((params: any) => params.status)
    ).subscribe(params => {
      this.tabselect = params.status;
      this.get();
    });
  }

  search() {
    this.searchResults = this.cust.searchCust(this.pickCustForm.value.custsearch, this.pickCustForm.value.data);
  }

  lockCust(res) {
    this.addRemForm.controls['cust_id'].setValue(res.cust_id);
    this.addRemForm.controls['company_name'].setValue(res.company_name);
    this.addRemForm.controls['data'].setValue(this.pickCustForm.value.data);
    this.bindAmt(res.customerCode, this.pickCustForm.value.data);
  }

  onNew() {
    this.addRemForm.controls['status'].setValue(this.status);
  }

  bindAmt(customerCode, data) {
    this.cust.getBalanceTotal(customerCode, data).subscribe(
      (dt: any) => {
        this.addRemForm.controls['amt'].setValue((dt.total).toFixed(2));
      });
  }

  cancelCust() {
    this.addRemForm.reset();
    this.pickCustForm.reset();
    this.pickCustForm.controls['data'].setValue(1);
  }

  loadId(id) {
    this.id = id;
  }

  public get filtTabs() {
    const filteredtabs = this.tabs.filter(tab => {
      switch (+this.row.status) {
        case 1:
          return tab.id === 1 || tab.id === 3;
          break;
        default:
          return tab.id === +this.row.status;
          break;
      }
    });
    return filteredtabs;
  }

  insertNew() {
    // tslint:disable-next-line:triple-equals
    this.addRemForm.controls['step'].setValue(this.addRemForm.value.status == 7 ? 2 : 1);
    this.addRemForm.controls['user'].setValue(this.user.user_id);
    this.dbt.insertReminder(this.addRemForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.addRemForm.reset();
        this.pickCustForm.reset();
        this.pickCustForm.controls['data'].setValue(1);
      }
    );
  }

  archiveEntry(id) {
    const object = {
      dbt_rem_id: id
    };

    const conf = confirm('Are you sure you want to archive this entry ?');
    if (conf) {
      this.dbt.archiveReminder(object).subscribe(
        (data) => {
          this.mdc.materialSnackBar(data);
        },
        (err) => {
          this.mdc.materialSnackBar(err.error);
        },
        () => {
          this.get();
          this.addRemForm.reset();
          this.pickCustForm.reset();
        }
      );
    }
  }

  loadInfo(row) {
    this.bindSubject(row);
    this.bindMessage(row);
    this.row = row;
    this.stat = 'Not Ready';

    let data;

    switch (row.company) {
      case 'DEL':
        data = 1;
        break;
      case 'RNS':
        data = 2;
        break;
      case 'PNP':
        data = 3;
        break;
    }

    this.statement = this.cust.getStatement(row.customerCode, data).pipe(
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
      tap((v) => this.stat = 'Ready')
    );
  }

  loadRow(row) {
    this.data = row;
    this.updateCourtForm.controls['dbt_rem_id'].setValue(this.data.dbt_rem_id);
    this.updateCourtForm.controls['user'].setValue(this.user.user_id);
    this.updatePayForm.controls['user'].setValue(this.user.user_id);
    this.updatePayForm.controls['dbt_rem_id'].setValue(this.data.dbt_rem_id);
    this.updatePayForm.controls['amount'].setValue(this.data.amtpaid ? this.data.amtpaid : 0);
    this.updateAmtDueForm.controls['user'].setValue(this.user.user_id);
    this.updateAmtDueForm.controls['dbt_rem_id'].setValue(this.data.dbt_rem_id);
    this.updateAmtDueForm.controls['newAmt'].setValue(this.data.amt ? this.data.amt : 0);
  }

  loadInfoCmt(row) {
    this.newCmtForm.setValue({
      cust_id: row.cust_id,
      dbt_rem_id: row.dbt_rem_id,
      user_id: this.user.user_id,
      username: this.user.username,
      date: dada(),
      comment: null
    });
  }

  bindSubject(row) {
    const subject = this.sendMail.controls['subject'];
    subject.setValue(row.company_name + ' - ' + this.name);

    this.cust.getEmailInfo(row.customerCode, row.data).subscribe(
      (data: any) => {
        let mail = data.email as string;
        mail = mail.replace(';', ',');
        this.sendMail.controls['email'].setValue(mail);
      }
    );
  }

  bindMessage(row) {
    const message = new Message(row.company, +row.status++, row);
    this.sendMail.controls['message'].setValue(message.bindMessage());
  }

  renderPDF() {
    const pdf: jsPDF = new jsPDF('p', 'pt', 'a4');
    const statementtable = <HTMLTableElement>document.getElementById('statementtable');
    const baltable = <HTMLTableElement>document.getElementById('baltable');

    const stateres = (pdf as any).autoTableHtmlToJson(statementtable, true);
    const balres = (pdf as any).autoTableHtmlToJson(baltable, true);

    const result = chunkArray(stateres.rows, 20);
    const width = pdf.internal.pageSize.getWidth() - 15;

    const totalPagesExp = '{total_pages_count_string}';
    const total = Number(this.total.toFixed(2));
    const cust = this.row;

    const footer = statementFT(cust.company);
    const header = statementLH(cust.company);
    const img = image(cust.company);
    for (let i = 0; i < result.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      (pdf as any).autoTable(stateres.columns, result[i], {
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
          pdf.addImage(img, 'JPEG', 210, 22, 215, 44);
          pdf.setFontSize(8);
          pdf.setFontType('normal');
          pdf.text(header.address, 210, 82);
          pdf.text(header.tel, 210, 96);
          pdf.text(header.vat, 210, 110);
          pdf.setFontType('bold');
          pdf.setFontSize(17.5);
          pdf.setTextColor(23, 73, 144);
          pdf.text(header.title, 210, 135);
          pdf.setFontSize(8.8);
          pdf.setFontType('normal');
          pdf.setTextColor(0);
          pdf.text(`As at ${convertDate2()}`, 250, 155);
          pdf.text(cust.company_name, 15, 170);
          pdf.text(cust.Physical1 || '', 15, 185);
          pdf.text(cust.Physical2 || '', 15, 200);
          pdf.text(cust.Physical3 || '', 15, 215);
          pdf.text(`VAT No : ${cust.Tax_Number || ''}`, 250, 185);
          pdf.text(`B.R.No : ${cust.Registration || ''}`, 250, 200);
          pdf.text(`Customer Code: ${cust.customerCode || ''}`, 450, 170);
          pdf.text(`Statement Date : ${convertDateAlt()}`, 450, 185);
          pdf.setFontType('bold');
          pdf.text(`Amount Due (Rs) : ${Number(total.toFixed(2)).toLocaleString()}`, 450, 200);

          // pdf.text(`Page ${i + 1} of ` + totalPagesExp, 460, 170);

          pdf.setLineWidth(1);
          pdf.line(15, 255, width, 255);
        }
      });
      (pdf as any).autoTable(balres.columns, balres.rows, {
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
          pdf.text(footer[0], 15, 760);
          pdf.text(footer[1], 15, 772);
          pdf.text(footer[2], 15, 784);
          pdf.text(footer[3], 15, 796);
          pdf.text(footer[4], 15, 808);
          pdf.text(footer[5], 15, 820);
          pdf.text(footer[6], 15, 832);
        }
      });
    }

    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }

    if (statementtable && baltable) {
      return pdf;
    }
  }

  savePDF() {
    const cust = this.row;
    const custCode = cust.customerCode;
    const pdf = this.renderPDF();
    pdf.save(`SOA_${custCode}_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`);
  }

  sendPDF() {
    const cust = this.row;
    const custCode = cust.customerCode;
    const object = {
      mailOptions: {}
    };

    let from;

    switch (cust.company) {
      case 'DEL':
        from = '"Accounts DelOffice" <accounts@deloffice.mu>';
        break;
      case 'RNS':
        from = '"Accounts Roll n Sheet" <accounts@rollnsheet.mu>';
        break;
      case 'PNP':
        from = '"Accounts Print n Pack" <accounts@printnpack.mu>';
        break;
    }

    const postObj = {
      dbt_rem_id: this.id,
      status: this.status + 1,
      step: 1,
      name: this.name,
      user_id: this.user.user_id,
      company_name: cust.company_name,
      company: cust.company,
      cust_id: cust.cust_id
    };

    if (this.overrideTab) {
      postObj.status = this.overrideTab;
    }

    object.mailOptions = {
      from: `${from}`,
      to: this.sendMail.value.email,
      bcc: `"Reminder DelOffice" <reminder@deloffice.mu>, "Accounts DelOffice" <accounts@deloffice.mu>`,
      subject: this.sendMail.value.subject,
      html: this.sendMail.value.message,
      attachments: [
        {
          filename: `SOA_${custCode}_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`,
          content: (this.renderPDF().output('datauristring')).split(',')[1],
          encoding: 'base64'
        },
        {
          filename: 'signature.png',
          content: signature(cust.company).split(',')[1],
          encoding: 'base64',
          cid: 'signature'
        }
      ],
      priority: 'high'
    };

    this.cust.sendStatement(object).pipe(
      switchMap((data) => {
        if (data.status === 'sent') {
          return this.dbt.updateReminder(postObj);
        }
        return;
       })
    ).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.overrideTab = null;
      }
    );
  }

  loadCmts(id) {
    this.dbt_id = id;
    this.newCmtForm.controls['dbt_rem_id'].setValue(this.dbt_id);
    return this.comments = this.dbt.getRemComments(id);
  }

  cancel() {
    this.row = null;
  }

  cancelMail() {
    this.row.status--;
    this.sendMail.reset();
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

  checkBtnState($event) {
    if ($event.target.classList.contains('disabled')) {
      $event.preventDefault();
      alert('You cannot send this reminder without admin authorization.');
    }
  }

  authorizeSend($event, row) {
    const postObj = {
      dbt_rem_id: row.dbt_rem_id
    };

    const conf = confirm('Confirm permission grant to send this reminder ?');
    if (conf) {
      this.dbt.authReminder(postObj).subscribe(
        (data) => {
          this.mdc.materialSnackBar(data);
        },
        (err) => {
          this.mdc.materialSnackBar(err.error);
        },
        () => {
          this.get();
        }
      );
    } else {
      $event.preventDefault();
    }
  }

  insert() {
    this.dbt.insertComment(this.newCmtForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.comments = this.dbt.getRemComments(this.newCmtForm.value.dbt_rem_id);
        this.loadInfoCmt(this.newCmtForm.value);
        this.get();
      }
    );
  }

  updateAmtDue() {
    this.dbt.updateAmtDue(this.updateAmtDueForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

  updateAmtPaid() {
    this.dbt.updateAmtPaid(this.updatePayForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

  updateCourtDate() {
    this.dbt.updateCourtDate(this.updateCourtForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

  sendToCourt(row) {
    const object = {
      dbt_rem_id: row.dbt_rem_id,
      user: this.user.user_id
    };

    const conf = confirm('Are you sure you want to send this entry to Court Cases ?');

    if (conf) {
      this.dbt.sendToCourt(object).subscribe(
        (data) => {
          this.mdc.materialSnackBar(data);
        },
        (err) => {
          this.mdc.materialSnackBar(err.error);
        },
        () => {
          this.get();
        }
      );
    } else {
      alert('Action cancelled');
    }
  }

}
