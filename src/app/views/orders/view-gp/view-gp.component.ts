import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../../../common/services/auth.service';
import { OrdersService } from '../../../common/services/orders.service';
import { MaterialService } from '../../../common/services/material.service';
import { PurgatoryService } from '../../../common/services/purgatory.service';

import { environment } from '../../../../environments/environment';
import { LocalStorage } from '../../../common/classes/localstorage';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, switchMap, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-view-gp',
  templateUrl: './view-gp.component.html',
  styleUrls: ['./view-gp.component.scss']
})
export class ViewGPComponent implements OnInit, DoCheck {
  loading = true;
  public invoice$: Observable<any>;

  public imgDirUrl = environment.imgUrl;

  entries = [];
  private _prodEntr$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public prodEnt$: Observable<any> = this._prodEntr$.asObservable();
  public tempProd: any;
  private _user: any;
  private _id: number;

  private _tempData: any;
  public tempData: any;
  
  public amendStatus = false;
  public allConfirmed = false;
  public noTransfer = true;
  public noAmendments = true;
  public selectedProd: any = null;

  public selectedTable = null;

  public locked = true;

  public columns = [
    'p_id',
    'des',
    'instk',
    'required',
    'onhand',
    'purchase',
    'transfer',
    'missing',
    'totalcheck',
    'onhandcheck',
    'status'
  ];

  public confirm: boolean = true;
  public verify: boolean = false;

  public formItems = new FormArray([])

  public prepareForm: FormGroup = this._fb.group({
    products: null
  })

  public requestForm: FormGroup = this._fb.group({
    transfer: ['purchase', Validators.required]
  });

  public loginForm: FormGroup = this._fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  })

  public tempUser = new LocalStorage<any>('gpUser');
  table$: Observable<any>;

  constructor(
    private _auth: AuthService,
    private _fb: FormBuilder,
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _purgatory: PurgatoryService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._auth.currentUser.subscribe(data => this._user = data);
  }

  ngOnInit() {
    // this.getTables();
    this.get();
    this.invoice$ = this.invoice$.pipe(
      tap((res) => {
        for (const entry of res.entries) {
          const formGroup = {}
          formGroup['required'] = new FormControl({value: entry.qty, disabled: false}, Validators.required)
          formGroup['onhand'] = new FormControl({value: entry.checked == 1 ? entry.qty : 0, disabled: false})
          formGroup['purchase'] = new FormControl({value: entry.checked == 1 ? 0 : entry.purchase, disabled: false})
          formGroup['transfer'] = new FormControl({value: entry.checked == 1 ? 0 : entry.transfer, disabled: false})
          formGroup['missing'] = new FormControl({value: entry.checked == 1 ? 0 : entry.amend, disabled: false})
          this.formItems.push(this._fb.group(formGroup))
        }

        this.prepareForm.controls['products'] = this.formItems
      }),
      tap((res) => {
        if (res.InvStatus == 8) {
          this.confirm = false;
          this.verify = true;
        } else {
          this.confirm = true;
          this.verify = false;
        }
      })
    );

  }

  public convertNum(item: string | number) {
    const idx = ('000000' + (+(item) + 1)).slice(-6);
    return 'No. '+idx;
  }

  ngDoCheck() {
    this.allConfirmed = (this._prodEntr$.value as any[]).every(item => item.checked == 1);

    if (this.f) {
      if ((this.f as any[]).reduce((acc, curr) => acc + +curr.controls['missing'].value, 0) > 0) {
        this.noAmendments = false;
      } else {
        this.noAmendments = true;
      }

      if ((this.f as any[]).reduce((acc, curr) => acc + +curr.controls['purchase'].value + +curr.controls['transfer'].value, 0) > 0) {
        this.noTransfer = false;
      } else {
        this.noTransfer = true;
      }
    }
  }

  public updateMissing(control: Object, name?: string) {
    let total = (control['onhand'] as FormControl).value + (control['purchase'] as FormControl).value + (control['transfer'] as FormControl).value
    let val: any = +control['required'].value - total;
    if (val < 0) {
      val = 'ERR';
    }
    (control['missing'] as FormControl).setValue(val)

    if (!control['purchase'].value || control['purchase'].value == 0) {
      (control['purchase'] as FormControl).setValue(0)
    }
    if (!control['transfer'].value || control['transfer'].value == 0) {
      (control['transfer'] as FormControl).setValue(0)
    }
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
        this.tempData = res;
        
        this._prodEntr$.next(res.entries);
        this.loading = false;

        
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  public get f(): any {
    return (this.prepareForm.controls['products'] as FormArray).controls
  }

  public totalRow(fVal: Object) {
    return +(fVal['onhand'].value) + +(fVal['purchase'].value) + +(fVal['transfer'].value);
  }

  public totalRowTouched(fVal: Object) {
    const identifiers = Object.keys(fVal)
    const active = identifiers.filter(id => {
      return (fVal[id] as FormControl).touched
    })
    return active.length > 0;
  }

  public rowStatus(fVal: Object): string {
    let error = [];
    if (fVal['purchase'].value > 0) {
      error.push(fVal['purchase'].value + ' Purchase')
    }

    if (fVal['transfer'].value > 0) {
      error.push(fVal['transfer'].value + ' Transfer')
    }

    if (fVal['missing'].value > 0) {
      error.push(fVal['missing'].value + ' Missing')
    }

    if (error.length > 0) {
      return error.join(', ')
    }
  }

  public autoFill(fVal: Object) {
    (fVal['onhand'] as FormControl).markAsTouched();
    (fVal['purchase'] as FormControl).setValue(0);
    (fVal['transfer'] as FormControl).setValue(0);
    (fVal['onhand'] as FormControl).setValue(fVal['required'].value - (fVal['purchase'].value + fVal['transfer'].value));
  }

  public autoFill2(fVal: Object) {
    if (fVal['purchase'].value > 0 || fVal['transfer'].value > 0 || fVal['missing'].value > 0) {
      (fVal['onhand'] as FormControl).markAsTouched();
      (fVal['onhand'] as FormControl).setValue(fVal['required'].value - (fVal['purchase'].value + fVal['transfer'].value + fVal['missing'].value));
    }
  }

  // Read Tables

  public getTables(): void {
    this.table$ = this._purgatory.readTables().pipe(
      map(data => data.records)
    );
  }

  public start() {
    // console.log(this._tempData)
    const obj = {
      invoice_id: this._id,
      user: this._user.user_id,
      workflow_id: this._tempData.workflow_id,
      company_name: this._tempData.company_name,
      customerCode: this._tempData.customerCode,
      tr_status: 1
    }

    if (this.verify) {
      obj.tr_status = 2;
      obj.user = JSON.parse(localStorage.getItem('gpUser')) ? JSON.parse(localStorage.getItem('gpUser')).user_id : this._user.user_id;
    }

    console.log(obj)

    const data = {
      workflow_id: this._tempData.workflow_id,
      tableId: this.selectedTable
    };

    this._order.startGP(obj).pipe(
      switchMap(dt => {
        if (this._tempData.tableId > 0) {
          return of(dt)
        } else {
          return this._purgatory.newSession(data)
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
        this.locked = false;

        (this._tempData.entries as any[]).forEach((item, index) => {
          // this.updateMissing((this.f[index] as any).controls)
          this.autoFill2((this.f[index] as any).controls)
        })

      }
    )
  }

  public tempLogin() {
    this._auth.tempLogin(this.loginForm.value)
      .subscribe(
        (data) => {
          this._mdc.materialSnackBar(data);
          this.tempUser.set('gpUser', data);
        },
        (err) => {
          this._mdc.materialSnackBar(err.error);
        },
        () => {
          this.start();
        }
      );
  }

  public save() {
    this._prodEntr$.pipe(
      take(1),
      switchMap((data: any[]) => {
        const mappedData = data.map((entry, index) => {
          console.log(this.prepareForm.controls.products.value)
          return ({...entry, ...this.prepareForm.controls.products.value[index]})
        })
        let obj: any = { entries: mappedData, workflow_id: this._tempData.workflow_id };
        if (this.confirm) {
          obj.status = 1;
        } else if (this.verify) {
          obj.status = 2;
        }
        return this._order.saveGP(obj)
        // return of(obj)
      }),
      switchMap((data) => {
        const info = {
          tableId: this._tempData.tableId,
          workflow_id: this._tempData.workflow_id
        }
        return this._purgatory.closeSession(info);
      }),
    ).subscribe(
      (data) => {
        console.log(data)
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        
        // this._router.navigate(['/workflow/goods-preparation'])
      }
    )
  }

  public markStatus(row: any, status: number, data: number, index: number) {
    const obj = {
      case: +status,
      status: data,
      invlineid: row.invlineid,
      cust_id: this._tempData.cust_id,
      data: this._tempData.data,
      prod: null,
      qty: null,
      workflow_id: this._tempData.workflow_id
    }

    switch (obj.case) {
      case 1:
        obj.qty = this.f[index].controls['missing'].value;
        break;
      case 2:
        obj.qty = this.f[index].controls['purchase'].value;
        break;
      case 3:
        obj.qty = this.f[index].controls['transfer'].value;
        break;
    }

    obj.prod = row;
    console.log(obj)
    this._order.markStatus(obj)
    .subscribe(
      (data) => {
        console.log(data)
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.invoice$ = this.invoice$.pipe(
          tap((res) => {
            for (const entry of res.entries) {
              const formGroup = {}
              formGroup['required'] = new FormControl({value: entry.qty, disabled: false}, Validators.required)
              formGroup['onhand'] = new FormControl({value: entry.checked == 1 ? entry.qty : 0, disabled: false})
              formGroup['purchase'] = new FormControl({value: entry.checked == 1 ? 0 : entry.purchase, disabled: false})
              formGroup['transfer'] = new FormControl({value: entry.checked == 1 ? 0 : entry.transfer, disabled: false})
              formGroup['missing'] = new FormControl({value: entry.checked == 1 ? 0 : entry.amend, disabled: false})
              this.formItems.push(this._fb.group(formGroup))
            }
    
            this.prepareForm.controls['products'] = this.formItems
          }),
          tap((res) => {
            if (res.InvStatus == 8) {
              this.confirm = false;
              this.verify = true;
            } else {
              this.confirm = true;
              this.verify = false;
            }
          })
        );
        // this._router.navigate(['/workflow/goods-preparation'])
      }
    )
  }

  public sendToVerify() {
    this._prodEntr$.pipe(
      take(1),
      switchMap((products: any[]) => {
        if (products.every(item => item.checked == 1)) {
          const postData = {
            invoice_id: this._id,
            workflow_id: this._tempData.workflow_id,
            user: this._user.user_id,
            step: 3
          }
          return this._order.changeStatus(postData)
        } else {
          alert('All products must be checked before sending to verify mode.')
          return of(null)
        }
      })
    ).subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this._router.navigate(['/workflow/goods-preparation'])
      }
    )
  }

  public goodsReady() {
    this._prodEntr$.pipe(
      take(1),
      switchMap((products: any[]) => {
        if (products.every(item => item.verified == 1)) {
          const postData = {
            invoice_id: this._id,
            workflow_id: this._tempData.workflow_id,
            user: this._user.user_id,
            step: 4
          }
          return this._order.changeStatus(postData);
        } else {
          alert('All products must be verified before sending to Goods Ready.')
          return of(null)
        }
      })
    ).subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this._router.navigate(['/workflow/goods-preparation'])
      }
    )
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
            user: JSON.parse(localStorage.getItem('gpUser')) ? JSON.parse(localStorage.getItem('gpUser')).user_id : this._user.user_id,
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
        this._mdc.materialSnackBar({message: 'Update successful!'});
      },
      (err) => {
        this._mdc.materialSnackBar({message: 'Update failed. An error occured'});
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