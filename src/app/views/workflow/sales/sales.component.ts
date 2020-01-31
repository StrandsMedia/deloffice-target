import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { MaterialService } from '../../../common/services/material.service';
import { WorkflowService } from '../../../common/services/workflow.service';
import { QuestionControlService } from '../popup/utils/question-control.service';
import { CustomerService } from '../../../common/services/customer.service';

import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { OrdersService } from '../../../common/services/orders.service';
import { HttpEventType } from '@angular/common/http';
import { getExtension } from '../../products/image-data';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, DoCheck {
  public dataSource$: Observable<any>;
  public customer$: Observable<any>;

  mode = 1;

  lockedCust = null;
  wfItem = null;
  public asc = true;
  clicked = 0;
  public loading = false;
  public columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'company',
    'inquiry',
    'quotesent',
    'orderconfirm',
    'creditcontrol',
    // 'purchase',
    // 'invoicing',
    'duration'
  ];
  sortKey: any;
  upload = false;
  uploadname: string;

  questions: any[];

  public searchCustForm: FormGroup = this.fb.group({
    searchString: null,
    data: 1
  });

  public searchForm: FormGroup = this.fb.group({
    searchInput: ['']
  });

  public hasClass = false;

  formData: any;
  public user: any;

  constructor(
    private auth: AuthService,
    private cust: CustomerService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private wf: WorkflowService,
    private qcs: QuestionControlService,
    private cdRef: ChangeDetectorRef,
    private order: OrdersService
  ) {
    this.auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  ngDoCheck() {
    this.cdRef.detectChanges();
    if (this.formData && this.formData.status == 3 && this.formData.orderNo != '' && !this.upload) {
      // this.formData.valid = false;
    }

  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.getWorkflow(1).pipe(
      map((data: any) => {
        return data.records;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  update() {
    this.formData.user = this.user.user_id;
    this.formData.status = +this.formData.status;
    this.wf.changeStatus(this.formData).subscribe(
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
        setTimeout(() => this.formData.status = 0, 500);
        this.lockedCust = null;
      }
    );
  }

  // Sorting

  sort($event) {
    let sortKey = '';
    switch (this.clicked) {
      case 0:
        sortKey = $event.target.getAttribute('data-name');
        this.sortObs(sortKey, this.asc);
        this.sortKey = sortKey;
        this.clicked++;
        break;
      case 1:
        sortKey = $event.target.getAttribute('data-name');
        if (this.sortKey === sortKey) {
          this.sortObs(sortKey, !this.asc);
          this.clicked++;
        } else {
          this.sortObs(sortKey, this.asc);
          this.clicked = 1;
        }
        this.sortKey = sortKey;
        break;
      case 2:
        sortKey = $event.target.getAttribute('data-name');
        if (this.sortKey === sortKey) {
          this.get();
          this.sortKey = '';
          this.clicked = 0;
        } else {
          this.sortObs(sortKey, this.asc);
          this.sortKey = sortKey;
          this.clicked = 1;
        }
        break;
    }
  }

  sortObs(key, direction) {
    let dir;
    direction ? dir = 'asc' : dir = 'desc';
    return this.dataSource$ = this.wf.getWorkflow(1).pipe(
      map((data: any) => data.records),
      map((records) => {
        return records.sort((a, b) => {
          // tslint:disable-next-line:curly
          if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
          // tslint:disable-next-line:curly
          if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
          return 0;
        });
      })
    );
  }

  // Filter

  filter() {
    const q: string = (this.searchForm.value.searchInput).toLowerCase();
    return this.dataSource$ = this.wf.getWorkflow(1).pipe(
      map((data: any) => data.records),
      map(records => {
        return records.filter((record) => {
          const name = record['company_name'].toLowerCase() as any;
          return name.includes(q);
        });
      })
    );
  }

  editWF($event, row) {
    this.cdRef.detectChanges();
    if ($event.target.classList.contains('bg-primary')) {
      this.wf.retrieveProducts(row.workflow_id).subscribe(data => {
        const newdata = data;
        newdata.step = +$event.target.getAttribute('name');
        newdata.invoice_id = row.invoice_id;
        newdata.customerCode = row.customerCode;
        newdata.data = row.data;

        this.questions = this.qcs.getQuestions(Number(row.status), newdata);
      });
      
      this.hasClass = true;
    }
  }

  cancel() {
    this.hasClass = false;
    this.formData = null;
    setTimeout(() => this.formData.status = 0, 500);
  }

  loadInfo($event: any) {
    this.formData = $event;
    // console.log(this.formData);
  }

  searchCust() {
    const { searchString, data } = this.searchCustForm.value;
    this.customer$ = this.cust.searchCust(searchString, data);
  }

  assignCust(row) {
    this.lockedCust = row;
    const object = {
      step: 1,
      customerCode: row.customerCode,
      data: row.data
    };
    this.questions = this.qcs.getQuestions(-1, object);
  }

  cancelEntry() {
    const obj = {
      step: 2,
      user: this.user.user_id,
      status: 14,
      workflow_id: this.wfItem.workflow_id,
      data: this.wfItem.data,
      note: null
    }
    this.wf.changeStatus(obj).subscribe(
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
        this.wfItem = null;
      }
    );
  }

  updateNew() {
    this.loading = true;
    this.formData.user = this.user.user_id;
    this.formData.status = +this.formData.status;
    this.formData.cust_id = this.lockedCust.cust_id;
    let data = {...this.formData, ...this.lockedCust};
    console.log(data);
    this.wf.changeStatus(this.formData)
    .pipe(
      switchMap(dt => {
          return this.order.changeStatus(data);
      })
    )
    .subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
        this.lockedCust = null;
        this.formData = {};
        this.questions = null;
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        
        setTimeout(() => this.formData.status = 0, 500);
        this.searchCustForm.reset();
        this.searchCustForm.controls['data'].setValue(1);
        this.loading = false;
        this.lockedCust = null;
        this.formData = {};
        this.questions = null;
      }
    );
  }

  public convertNum(item: string | number) {
    const idx = ('000000' + (+(item) + 1)).slice(-6);
    return idx;
  }

  uploadFile($event, name?: string) {
    const file = <File>$event.target.files[0];

    const ext = getExtension(file)

    name = this.convertNum(name);

    const fd = new FormData();
    fd.append('file', file, name + '.' + ext || 'file' + '.' + ext)

    console.log(name + '.' + ext)
    this.uploadname = name + '.' + ext;
    
    this.loading = true;

    this.wf.uploadFile(fd).subscribe(
      (data) => {
        if (data.type === HttpEventType.Response) {
          this.mdc.materialSnackBar(data.body);
        }
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.loading = false;
        this.upload = true;
      }
    );
  }

  cancelFile() {
    this.upload = false;
    this.uploadname = null;
  }

}
