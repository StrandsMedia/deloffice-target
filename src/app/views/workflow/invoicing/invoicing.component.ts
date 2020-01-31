import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../common/services/auth.service';
import { MaterialService } from '../../../common/services/material.service';
import { OrdersService } from '../../../common/services/orders.service';
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
  public invoice$: Observable<any>;

  public asc = true;
  clicked = 0;
  public loading = false;
  sortKey: any;
  public hasClass = false;
  formData: any;
  public user: any;
  public tempData: any = null;
  public err = false;

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

  public searchForm: FormGroup = this._fb.group({
    searchInput: ['']
  });

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _wf: WorkflowService
  ) { 
    this._auth.currentUser.subscribe(data => this.user = data);
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
    return this.dataSource$ = this._wf.getWorkflow(4).pipe(
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
    return this.dataSource$ = this._wf.getWorkflow(4).pipe(
      map((data: any) => data.records),
      map(records => {
        return records.filter((record) => {
          const name = record['company_name'].toLowerCase() as any;
          return name.includes(q);
        });
      })
    );
  }

  loadInfo(rowValue: any) {
    this.err = false;
    this.invoice$ = this._order.getInvoice(rowValue.invoice_id).pipe(
      map((data: any) => data.records[0]),
      tap(v => {
        const entries: any[] = v.entries;
        const condition = entries.every((item) => +item.Qty_On_Hand >= +item.qty)
        console.log(condition)
        if (!condition) {
          this.err = true;
        }
      }),
      tap(v => {
        console.log(v)
        this.tempData = v
      })
    )
  }

  public sendToPastel() {
    this._order.sendToPastel(this.tempData)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data)
      },
      (err) => {
        this._mdc.materialSnackBar(err.error)
      },
      () => {
        this.tempData = null;
        this.get();
      }
    )
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

  send() {
    console.log(this.tempData || this.err);
  }
}
