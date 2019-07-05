import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../../../common/services/auth.service';
import { OrdersService } from '../../../common/services/orders.service';
import { MaterialService } from '../../../common/services/material.service';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, switchMap, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-view-gp',
  templateUrl: './view-gp.component.html',
  styleUrls: ['./view-gp.component.scss']
})
export class ViewGPComponent implements OnInit {
  loading = true;
  public invoice$: Observable<any>;

  entries = [];
  private _prodEntr$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public prodEnt$: Observable<any> = this._prodEntr$.asObservable();
  public tempProd: any;
  private _user: any;
  private _id: number;

  private _tempData: any;
  public amendStatus = false;

  public columns = [
    'p_id',
    'des',
    'brand',
    'qty',
    'confirm',
    'verify',
    'transfer'
  ];

  public confirm: boolean = true;
  public verify: boolean = false;

  public requestForm: FormGroup = this._fb.group({
    transfer: ['purchase', Validators.required]
  });

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._auth.currentUser.subscribe(data => this._user = data);
  }

  ngOnInit() {
    this.get();
    this.invoice$ = this.invoice$.pipe(
      tap((res) => {
        const condition = (res.entries as any[]).every(item => item.checked == 1);

        if (!condition) {
          this.confirm = true;
          this.verify = false;
        } else {
          this.confirm = false;
          this.verify = true;
        }

        if (res.InvStatus == 2) {
          this.amendStatus = true;
        }
      })
    );

  }

  get() {
    this.loading = true;
    return this.invoice$ = this._route.params.pipe(
      map(params => params.id),
      switchMap(params => {
        this._id = +params;
        return this._order.getInvoice(+params);
      }),
      map((res: any) => res.records[0]),
      tap((res) => {
        this._tempData = res;
        
        this._prodEntr$.next(res.entries);
        this.loading = false;
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  public markChecked(id) {    
    this._order.markChecked(id)
    .pipe(
      switchMap(data => {
        return this.get().pipe(take(1));
      }),
      switchMap(data => {
        // console.log(data);
        const entries = data.entries;
        const condition = entries.every(item => item.checked == 1);
        // console.log(condition);
        if (condition) {
          const postData = {
            invoice_id: this._id,
            workflow_id: this._tempData.workflow_id,
            user: this._user.user_id,
            step: 3
          }
          setTimeout(() => this._router.navigate(['/workflow/goods-preparation']), 3000)
          return this._order.changeStatus(postData);
        } else {
          return of(data);
        }
      })
    )
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {

      }
    )
  }

  public markVerified(id) {
    this._order.markVerified(id)
    .pipe(
      switchMap(data => {
        return this.get().pipe(take(1));
      }),
      switchMap(data => {
        //console.log(data);
        const entries = data.entries;
        const condition = entries.every(item => item.verified == 1);
        //console.log(condition);
        if (condition) {
          const postData = {
            invoice_id: this._id,
            workflow_id: this._tempData.workflow_id,
            user: this._user.user_id,
            step: 4
          }
          setTimeout(() => this._router.navigate(['/workflow/goods-preparation']), 3000)
          
          return this._order.changeStatus(postData);
          
        } else {
          return of(data);
        }
      })
    )
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        
      }
    )
  }

  public sendRequest() {
    const data = {
      user: this._user.user_id,
      invoice_id: this._tempData.invoice_id,
      entryType: this.requestForm.value.transfer,
      p_id: this.tempProd.p_id,
      debit: this.tempProd.qty,
      credit: 0,
      outstd: this.tempProd.qty,
      invlineid: this.tempProd.invlineid,
      workflow_id: this._tempData.workflow_id
    }

    console.log(data);
    this._order.sendReqTransfer(data)
    .subscribe(
      (dt) => {
        this._mdc.materialSnackBar(dt);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    )
  }

  public sendForAmendment(): void {
    const data = {
      invoice_id: this._id,
      workflow_id: this._tempData.workflow_id,
      user: this._user.user_id,
      step: 2
    };

    this._order.changeStatus(data)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.amendStatus = true;
        this._router.navigate(['/workflow/goods-preparation']);
      }
    )
  }
}