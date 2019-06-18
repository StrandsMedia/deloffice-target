import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/common/services/auth.service';
import { CustomerService } from 'src/app/common/services/customer.service';
import { DebtorsService } from 'src/app/common/services/debtors.service';
import { MaterialService } from 'src/app/common/services/material.service';

import { dada } from 'src/app/common/interfaces/letterhead';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap, debounceTime } from 'rxjs/operators';
import { renderPDF } from '../statement';
import { QuestionControlService } from '../../workflow/popup/utils/question-control.service';
import { signature, messageSOA } from '../reminder/reminder.messages';
import { doubleControlChecker } from 'src/app/common/utils/unique.validator';
import { NotificationService } from 'src/app/common/services/notification.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, DoCheck {
  dataSource$: Observable<any>;
  searchResults: Observable<any>;

  balance: Observable<any>;
  status = '1';
  user: any;
  data = new BehaviorSubject<number>(null);

  newtotal = 0;
  newbal = 0;

  selectedid: any;

  statement = false;

  selected: Observable<any>;
  selecteddata: any;

  remselect: any;

  soa: Observable<any>;

  formData: any;
  searchstring: any;
  batch: any[] = [];
  toggle: boolean;

  terms = [
    'Current',
    '30 days',
    '60 days',
    '90 days',
    '120 days',
    '150 days',
    '180 days'
  ];
  columns = [
    'terms',
    'balance'
  ];

  public column = [
    'date',
    'customer',
    'company',
    'rem',
    'contact',
    'awaitfeed',
    'search',
    'chase',
    'dispute',
    'expect',
    'cheque',
    'tsk',
    'edit',
    'mark'
  ];

  public statusForm: FormGroup = this.fb.group({
    status: this.status
  });

  public searchForm: FormGroup = this.fb.group({
    custsearch: null,
    data: '1'
  });

  public searchFilterForm: FormGroup = this.fb.group({
    searchstring: null
  });

  public batchReviewForm: FormGroup = this.fb.group({
    dc_id: null,
    user: null
  });

  public addControlForm: FormGroup = this.fb.group({
    cust_id: [null, [Validators.required], [ ]],
    company_name: [null, Validators.required],
    data: [null, Validators.required],
    agent: [null, Validators.required],
    status: [null, Validators.required]
  });

  public newCmtForm: FormGroup = this.fb.group({
    comment: null,
    user_id: null,
    date: dada(),
    cust_id: null,
    dc_id: null
  });

  public addCollectForm = this.fb.group({
    cust_id: null,
    company_name: null,
    pay_method: 1,
    dc_id: null,
    delivery_pay: null,
    comment: null,
    data: null,
    user: null,
    username: null,
    type: 0,
    amount: null,
    remarks: null,
    region: 'North'
  });

  public sendMail = this.fb.group({
    email: [null, Validators.required],
    subject: [null, Validators.required],
    message: [null, Validators.required],
    attachment: null
  });
  loading = false;
  hasClass = false;
  total: number;
  baltotal: any;
  questions: any[];
  choice: string;

  users: Observable<any>;

  public newTaskForm: FormGroup = this.fb.group({
    taskname: [null, Validators.required],
    user: [null],
    assignedTo: [null]
  });

  public taskFrm: FormGroup = this.fb.group({
    choice: 'self'
  });

  public newReminderForm: FormGroup = this.fb.group({
    reminder_name: [null, Validators.required],
    reminder_date: [null, Validators.required],
    reminder_time: [null, Validators.required],
    user: [null, Validators.required]
  });

  constructor(
    private auth: AuthService,
    private cust: CustomerService,
    private dbt: DebtorsService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private ntn: NotificationService,
    private qcs: QuestionControlService,
    private router: Router
  ) {
    auth.currentUser.subscribe((data) => this.user = data);
    this.newCmtForm.controls['user_id'].setValue(+this.user.user_id);
  }

  ngOnInit() {
    this.choice = 'self';
    this.get();
    this.users = this.auth.getUsers().pipe(
      map(res => res.records),
      map((user: []) => {
        const newarr = user.filter(usr => {
          if (usr['status'] === '1') {
            return usr;
          }
        });
        return user;
      })
    );
  }

  ngDoCheck() {
    this.data.next(+this.searchForm.value.data);
    this.addControlForm.controls['cust_id'].setAsyncValidators(doubleControlChecker(this.dbt, this.data.value));
  }

  addNewTask() {
    this.ntn.createTask(this.newTaskForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        //
      }
    );
  }

  getDefaultReview(row) {
    if (row.review) {
      const date = new Date(row.review.reviewAt);
      date.setDate(date.getDate() + row.review.reviewPeriod);

      return date;
    }
  }

  bindTsk() {
    this.newTaskForm.controls['user'].setValue(this.user.user_id);
    this.newReminderForm.controls['user'].setValue(this.user.user_id);
  }

  addNewReminder() {
    const remForm = this.newReminderForm.value;
    const datetime = this.formatDate(new Date(remForm.reminder_date + ' ' + remForm.reminder_time));
    const postObj = {
      reminder_name: remForm.reminder_name,
      reminder_time: datetime,
      user: remForm.user
    };

    this.ntn.createReminder(postObj).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        //
      }
    );
  }

  sendForReview() {
    this.batchReviewForm.controls['user'].setValue(this.user.user_id);
    this.batchReviewForm.controls['dc_id'].setValue(this.batch);

    console.log(this.batchReviewForm.value);
    this.dbt.sendForReview(this.batchReviewForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.cancelReview();
        this.router.navigate(['/debtors/review']);
      }
    );
  }

  cancelReview() {
    this.batch = [];
  }

  formatDate(d = new Date) {
    let day = String(d.getDate());
    let month = String(d.getMonth() + 1);
    const year = String(d.getFullYear());

    let hour = String(d.getHours());
    let minute = String(d.getMinutes());
    let seconds = String(d.getHours());

    // tslint:disable-next-line:curly
    if (month.length < 2) month = '0' + month;
    // tslint:disable-next-line:curly
    if (day.length < 2) day = '0' + day;
    // tslint:disable-next-line:curly
    if (hour.length < 2) hour = '0' + hour;
    // tslint:disable-next-line:curly
    if (minute.length < 2) minute = '0' + minute;
    // tslint:disable-next-line:curly
    if (seconds.length < 2) seconds = '0' + seconds;

    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }

  public getComment(cmt: string) {
    if (cmt) {
      if (cmt.length > 12) {
        return cmt.slice(0, 35) + '...';
      }
    }
    return null;
  }

  toggleStatus() {
    this.status = this.statusForm.value.status;
    this.get();
  }

  get() {
    return this.dataSource$ = this.dbt.getControl(this.status, this.user.user_id).pipe(
      map(res => {
        if (res.records) {
          return res.records;
        }
        return res;
      }),
      map(res => {
        if (this.toggle) {
          return res.filter(item => item.review);
        } else {
          return res;
        }
      }),
      tap(v => {
        // this.searchForm.controls['data'].setValue(1);
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  fetch($event) {
    return this.dataSource$ = this.dbt.searchControl($event.target.value).pipe(
      debounceTime(1000),
      map(res => {
        if (res.records) {
          return res.records;
        }
        return res;
      })
    );
  }

  public getAmt(amt: any): string {
    if (amt === '0.0' || amt === null) {
      return '-';
    }

    if (amt < 0) {
      return `(${(Math.abs(amt)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')})`;
    }

    return Number(amt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  renderDocs(row) {
    const arr = [];
    if (row.inv) {
      arr.push('INV');
    }
    if (row.dn) {
      arr.push('DN');
    }
    if (row.crn) {
      arr.push('CRN');
    }
    if (row.oth) {
      arr.push('OTH');
    }

    if (arr.length > 0) {
      return 'Docs: ' + arr.join(', ');
    }

    return '';
  }

  renderDispute(row) {
    if (row.dispute) {
      let resp = 'Dispute: ';
      switch (row.dispute) {
        case 'Y':
          resp += 'Yes';
          break;
        case 'N':
          resp += 'No';
          break;
        case 'D':
          resp += 'Done';
          break;
      }
    }
    return;
  }

  renderAdjs(row) {
    if (row.adjs) {
      let resp = 'Adjs: ';
      switch (row.adjs) {
        case 'Y':
          resp += 'Yes';
          break;
        case 'N':
          resp += 'No';
          break;
        case 'D':
          resp += 'Done';
          break;
      }
    }
    return;
  }

  renderComments(row) {
    this.selecteddata = row;
    this.loadComments();
  }

  bindInfo(row) {
    this.selecteddata = row;
  }

  bindCCInfo(row) {
    this.bindInfo(row);

    this.addCollectForm.controls['dc_id'].setValue(this.selecteddata.dc_id);
    this.addCollectForm.controls['cust_id'].setValue(this.selecteddata.cust_id);
    this.addCollectForm.controls['company_name'].setValue(this.selecteddata.company_name);
    this.addCollectForm.controls['remarks'].setValue(this.selecteddata.address);
    this.addCollectForm.controls['data'].setValue(this.selecteddata.data);
    this.addCollectForm.controls['user'].setValue(this.user.user_id);
    this.addCollectForm.controls['username'].setValue(this.user.username);
  }

  insertCC() {
    const delivery_pay = this.addCollectForm.value.delivery_pay;
    // tslint:disable-next-line:triple-equals
    this.addCollectForm.controls['delivery_pay'].setValue(delivery_pay == 1 ? 1 : 0);
    this.dbt.chainEntry(this.addCollectForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.cancel();
        this.searchForm.controls['data'].setValue(1);
      }
    );
  }

  loadInfo(row) {
    this.bindInfo(row);

    this.cust.getEmailInfo(this.selecteddata.customerCode, this.selecteddata.data).subscribe(
      (data: any) => {
        let mail = data.email as string;
        mail = mail.replace(';', ',');
        this.sendMail.controls['email'].setValue(mail);
        this.sendMail.controls['message'].setValue(messageSOA);
      }
    );
    this.soa = this.dbt.getControlById(this.selecteddata.dc_id, this.selecteddata.data).pipe(
      map(data => {
        this.balance = this.cust.getBalance(this.selecteddata.customerCode, this.selecteddata.data).pipe(
          map((bal) => {
            this.newtotal = bal['records'].reduce((acc, curr) => acc + +curr.Outstanding, 0);
            return bal;
          })
        );
        return data;
      }),
      switchMap(data => {
        this.selecteddata = data.records[0];
        return this.cust.getStatement(this.selecteddata.customerCode, this.selecteddata.data);
      }),
      map(allocs => {
        if (allocs['records']) {
          allocs['records'].reduce((acc, curr) => {
            return curr['cum'] = +acc + +curr.Outstanding, this.total = +acc + +curr.Outstanding;
          }, 0);
          return allocs;
        } else {
          return null;
        }
      }),
      map(allocs => {
        if (allocs) {
          this.baltotal = allocs['balance'].reduce((acc, curr) => acc + +curr.Outstanding, 0);
          return allocs;
        } else {
          return null;
        }
      }),
      tap((v) => this.statement = true)
    );
  }

  loadComments() {
    this.selected = this.dbt.getControlById(this.selecteddata.dc_id, this.selecteddata.data).pipe(
      map(res => res.records[0]),
      tap(recs => {
        this.newCmtForm.controls['dc_id'].setValue(+recs.dc_id);
        this.newCmtForm.controls['cust_id'].setValue(+recs.cust_id);
        this.newCmtForm.controls['user_id'].setValue(this.user.user_id);
        this.newCmtForm.controls['date'].setValue(dada());
      }),
      map((res: any) => res.comments)
    );
  }

  selectRem(data) {
    if (data) {
      this.remselect = data;
    }
  }

  resetRem() {
    this.remselect = null;
  }

  nextDate(date) {
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    return d;
  }

  public getInitials(name: string): string {
    if (name) {
      return name.charAt(0);
    }

    return;
  }

  insertCmt() {
    this.dbt.insertCmtCtrl(this.newCmtForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.selected = null;
        this.loading = false;
        this.newCmtForm.reset();
        this.loadComments();
      }
    );
  }

  editEntry($event, row) {
    if ($event.target.classList.contains('bg-primary')) {
      this.selectedid = row;
      this.questions = this.qcs.getControl(Number(row.status));
      this.hasClass = true;
    }
  }

  editEntryBack(row, e) {
    e.preventDefault();
    this.selectedid = row;
    this.questions = this.qcs.getControl(Number(row.status));
    this.hasClass = true;
  }

  get soaStatus() {
    if (this.statement) {
      return 'Ready';
    } else {
      return 'Not Ready';
    }
  }

  savePDF() {
    const cust = this.selecteddata;
    const custCode = cust.customerCode;
    const pdf = renderPDF(this.selecteddata, this.total);
    pdf.save(`SOA_${custCode}_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`);
  }

  sendPDF() {
    const cust = this.selecteddata;
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

    object.mailOptions = {
      from: `${from}`,
      to: this.sendMail.value.email,
      bcc: `"Accounts DelOffice" <accounts@deloffice.mu>`,
      subject: this.sendMail.value.subject,
      html: this.sendMail.value.message,
      attachments: [
        {
          filename: `SOA_${custCode}_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`,
          content: (renderPDF(this.selecteddata, this.total).output('datauristring')).split(',')[1],
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

    this.cust.sendStatement(object).subscribe(
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

  search() {
    this.searchResults = this.cust.searchCust(this.searchForm.value.custsearch, this.searchForm.value.data);
  }

  lockCust(res) {
    this.addControlForm.controls['cust_id'].setValue(res.cust_id);
    this.addControlForm.controls['company_name'].setValue(res.company_name);
    this.addControlForm.controls['data'].setValue(this.searchForm.value.data);
    this.addControlForm.controls['agent'].setValue(this.user.user_id);
    this.addControlForm.controls['status'].setValue(1);
  }

  unlockCust() {
    this.addControlForm.controls['cust_id'].setValue(null);
    this.addControlForm.controls['company_name'].setValue(null);
    this.addControlForm.controls['data'].setValue(null);
  }

  get custid(): any {
    return this.addControlForm.get('cust_id');
  }

  insert() {
    this.dbt.insertControl(this.addControlForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.searchForm.reset();
        this.addControlForm.reset();
      }
    );
  }

  cancel() {
    this.searchForm.reset();
    this.addControlForm.reset();
  }

  loadData($event) {
    this.formData = $event;
    this.formData.dc_id = this.selectedid.dc_id;
    this.formData.cust_id = this.selectedid.cust_id;
    this.formData.user = this.user.user_id;
  }

  changeStatus() {
    this.dbt.changeStatus(this.formData).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.formData = null;
      }
    );
  }

  archiveEntry(row) {
    const info = {
      dc_id: row.dc_id,
      status: 6
    };
    const check = confirm('Are you sure you want to archive this entry ?');
    if (check) {
      this.dbt.changeStatus(info).subscribe(
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
      //
    }
  }

  // Review

  pushinto($event) {
    console.log($event.target.value);
    if ($event.target.checked) {
      if (!this.batch.includes(+$event.target.value)) {
        this.batch.push(+$event.target.value);
      }
    } else {
      if (this.batch.includes(+$event.target.value)) {
        this.batch.forEach((id, index) => {
          if (id === +$event.target.value) {
            this.batch.splice(index, 1);
          }
        });
      }
    }
    console.log(this.batch);
  }

  public flash(row, before): boolean {
    if (row.review) {
      const newDate: Date = new Date(row.review.reviewAt);
      const today = new Date();

      newDate.setDate(newDate.getDate() + row.review.reviewPeriod - before);

      if (today >= newDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }



}
