import { Component, OnInit } from '@angular/core';

import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-completion',
  templateUrl: './completion.component.html',
  styleUrls: ['./completion.component.scss']
})
export class CompletionComponent implements OnInit {
  public data$: Observable<any>;
  public loading: boolean;
  public status = 0;
  public columns = [
    'date',
    'customerCode',
    'company_name',
    'invNumber',
    'status',
    'workflow_id',
    'sessionID',
    'edit'
  ];

  constructor(
    private _wf: WorkflowService
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.loading = true;
    this.data$ = this._wf.getComplete()
    .pipe(
      map(res => res.records),
      map(records => {
        if (this.status == 1) {
          return records.filter((inv: any) => !inv.workflow_id);
        }
        return records;
      }),
      tap(v => this.loading = false)
    );
  }

  public trackByFn(index, item) {
    return index;
  }

}
