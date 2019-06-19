import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { MaterialService } from '../../../common/services/material.service';
import { WorkflowService } from '../../../common/services/workflow.service';
import { QuestionControlService } from '../popup/utils/question-control.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, DoCheck {
  public dataSource$: Observable<any>;
  public asc = true;
  clicked = 0;
  public loading = false;
  public columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'inquiry',
    'quotesent',
    'orderconfirm',
    // 'purchase',
    // 'invoicing',
    'duration'
  ];
  sortKey: any;

  questions: any[];

  public searchForm: FormGroup = this.fb.group({
    searchInput: ['']
  });

  public hasClass = false;

  formData: any;
  public user: any;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private wf: WorkflowService,
    private qcs: QuestionControlService,
    private cdRef: ChangeDetectorRef
  ) {
    this.auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  ngDoCheck() {
    this.cdRef.detectChanges();
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
    if ($event.target.classList.contains('bg-primary')) {
      this.wf.retrieveProducts(row.workflow_id).subscribe(data => {
        const newdata = data;
        newdata.step = +$event.target.getAttribute('name');

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
  }

}
