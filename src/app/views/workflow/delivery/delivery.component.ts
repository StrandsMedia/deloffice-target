import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
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
    'goodsready',
    'goodsalloc',
    'deliveryinprogress',
    'duration',
    'edit'
  ];
  sortKey: any;

  searchForm = this.fb.group({
    searchInput: ['']
  });
  loading: boolean;

  constructor(private wf: WorkflowService, private fb: FormBuilder) { }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.getWorkflow(2).pipe(
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

}
