import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WorkflowService } from '../../../common/services/workflow.service';
import { QuestionControlService } from '../popup/utils/question-control.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/common/services/auth.service';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit, DoCheck {
  dataSource$: Observable<any>;
  asc = true;
  clicked = 0;
  columns = [
    'workflow_id',
    'job_id',
    'date',
    'time',
    'company_name',
    'invoiced',
    // 'goodsready',
    'goodsalloc',
    'deliveryinprogress',
    'duration',
    'edit'
  ];
  sortKey: any;
  user: any;

  questions: any[];
  pushToDelArr: Array<number> = [];

  searchForm = this.fb.group({
    searchInput: ['']
  });
  loading: boolean;

  hasClass = false;

  formData: any;

  constructor(
    private auth: AuthService,
    private wf: WorkflowService,
    private mdc: MaterialService,
    private fb: FormBuilder,
    private qcs: QuestionControlService,
    private cdRef: ChangeDetectorRef
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  update() {
    this.formData.user = this.user.user_id;
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
        this.pushToDelArr = [];
      }
    );
  }

  ngDoCheck() {
    this.cdRef.detectChanges();
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.getWorkflow(5).pipe(
      map((data: any) => {
        if (data.records) {
          return data.records;
        }
      }),
      tap((data) => {
        this.loading = false;
      })
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
          this.sortObs();
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

  sortObs(key?, direction?) {
    let dir;
    direction ? dir = 'asc' : dir = 'desc';
    return this.dataSource$ = this.wf.getWorkflow(2).pipe(
      map((data: any) => data.records),
      map((records) => {
        if (key) {
          return records.sort((a, b) => {
            // tslint:disable-next-line:curly
            if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
            // tslint:disable-next-line:curly
            if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
            return 0;
          });
        } else {
          return records;
        }
      })
    );
  }

  // Filter

  filter() {
    const q: string = (this.searchForm.value.searchInput).toLowerCase();
    return this.dataSource$ = this.wf.getWorkflow(2).pipe(
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

  editBatch() {
    if (this.pushToDelArr.length > 0) {
        const newdata = {
          step: 8,
          workflow_id: this.pushToDelArr
        };

        this.questions = this.qcs.getQuestions(Number(7), newdata);
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

  pushToArr($event) {
    if ($event.target.checked) {
      if (!this.pushToDelArr.includes(+$event.target.value)) {
        this.pushToDelArr.push(+$event.target.value);
      }
    } else {
      if (this.pushToDelArr.includes(+$event.target.value)) {
        this.pushToDelArr.forEach((id, index) => {
          if (id === +$event.target.value) {
            this.pushToDelArr.splice(index, 1);
          }
        });
      }
    }
    console.log(this.pushToDelArr);
  }

}
