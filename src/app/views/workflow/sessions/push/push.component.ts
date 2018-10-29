import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { DragulaService } from 'ng2-dragula';

import { AuthService } from '../../../../common/services/auth.service';
import { WorkflowService } from '../../../../common/services/workflow.service';

import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit, OnDestroy {
  dataSource$: Observable<any>;
  subs = new Subscription();
  array: any = [];
  user_id: any;

  columns = [
    'workflow_id',
    'date',
    'time',
    'company_name',
    'status'
  ];

  // vehicles = [
  //   '4730 ZR 01',
  //   '5271 ZR 02',
  //   '629 MR 03',
  //   '3213 ZU 04',
  //   '3652 ZT 04',
  //   '2772 ZV 05',
  //   '5027 ZR 06'
  // ];

  searchForm = this.fb.group({
    searchInput: ['']
  });

  sessionForm = this.fb.group({
    status: 8,
    vehicle: ['', Validators.required],
    driver: ['', Validators.required],
    invoices: [this.fb.array(this.array), Validators.required],
    user: ['']
  });

  constructor(private auth: AuthService, private fb: FormBuilder, private wf: WorkflowService, private drag: DragulaService) {
    this.subs.add(this.drag.drop('delivery')
      .subscribe(({ name, el, target, source, sibling }) => {
        const workflow = {
          wfid: (el as any).dataset.workflow
        };
        if (target.id === 'target') {
          this.array.push(workflow);
        } else {
          for (let i = 0; i < this.array.length; i++) {
            if (this.array[i].wfid === workflow.wfid) {
              this.array.splice(i, 1);
              break;
            }
          }
        }
        this.sessionForm.setControl('invoices', this.fb.array(this.array || []));
      })
    );
  }

  ngOnInit() {
    this.get();
    this.auth.currentUser.subscribe((data) => {
      this.user_id = data.user_id;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get() {
    return this.dataSource$ = this.wf.getGoodsReady().pipe(
      map((data: any) => {
        return data.records;
      }),
    );
  }

  trackByFn(index, item) {
    return index;
  }

  submit() {
    this.sessionForm.setControl('user', new FormControl(this.user_id));
    console.log(this.sessionForm.value);
  }

  reset() {
    this.array = [];
  }

  // Filter

  filter() {
    const q: string = (this.searchForm.value.searchInput).toLowerCase();
    return this.dataSource$ = this.wf.getGoodsReady().pipe(
      map((data: any) => data.records),
      map(records => {
        return records.filter((record) => {
          const invoiceNo = record['invoiceNo'].toLowerCase() as any;
          return invoiceNo.includes(q);
        });
      })
    );
  }

}
