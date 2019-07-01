import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { WorkflowService } from '../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss']
})
export class InvoicingComponent implements OnInit {
  public dataSource$: Observable<any>;
  public asc = true;
  clicked = 0;
  public loading = false;
  sortKey: any;
  public hasClass = false;
  formData: any;
  public user: any;

  public columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'company',
    'goodsready',
    'invoicing',
    'invoiced',
    'duration'
  ];

  public searchForm: FormGroup = this.fb.group({
    searchInput: ['']
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private wf: WorkflowService
  ) { 
    this.auth.currentUser.subscribe(data => this.user = data);
   }

  ngOnInit() {
    this.get();
    // this.refresh();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.loading = true;
    return this.dataSource$ = this.wf.getWorkflow(4).pipe(
      map((data: any) => {
        return data.records;
      }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  filter() {
    const q: string = (this.searchForm.value.searchInput).toLowerCase();
    return this.dataSource$ = this.wf.getWorkflow(4).pipe(
      map((data: any) => data.records),
      map(records => {
        return records.filter((record) => {
          const name = record['company_name'].toLowerCase() as any;
          return name.includes(q);
        });
      })
    );
  }

  editWF($event) {
    console.log(this.hasClass);
    if ($event.target.classList.contains('bg-primary')) {
      this.hasClass = true;
    }
  }

  refresh() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
}
