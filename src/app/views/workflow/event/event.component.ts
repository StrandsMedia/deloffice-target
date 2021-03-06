import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params,  } from '@angular/router';

import { WorkflowService } from 'src/app/common/services/workflow.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { QuestionControlService } from '../popup/utils/question-control.service';

import { Observable, combineLatest } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { doubleChecker } from 'src/app/common/utils/unique.validator';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, DoCheck {
  event$: Observable<any>;
  id: number;
  user;
  public loading: boolean;

  response;

  columns = [
    'date',
    'time',
    'agent',
    'status',
    'details',
    'duration',
    'durationplus',
    'comment'
  ];


  public deliveryForm = this._fb.group({
    workflow_id: this.id,
    instructions: null,
    step: 5,
    user: null
  });

  public purchaseForm = this._fb.group({
    workflow_id: this.id,
    instructions: null,
    step: 6,
    user: null
  });

  public changeInvoiceForm: FormGroup;
  formData: any;
  questions: any;

  constructor(
    private _auth: AuthService,
    private _cdRef: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _qcs: QuestionControlService,
    private _wf: WorkflowService
  ) {
    this._auth.currentUser.subscribe(data => {
      if (data) {
        return this.user = data;
      }
    });
  }

  ngOnInit() {
    this.get();
    this.changeInvoiceForm = this._fb.group({
      workflow_id: null,
      invoiceNo: [
        null,
        [
          Validators.required,
          Validators.pattern(/(([iI][nN][vV])+([0-9]{6})|([sS][oO])+([0-9]{5}))/g),
        ],
        [
          doubleChecker(this._wf, this.id)
        ]
    ],
      step: 4,
      user: null
    });
  }

  trackByFn(index, item) {
    return index;
  }

  ngDoCheck() {
    this._cdRef.detectChanges();
  }

  get invoiceNo() { return this.changeInvoiceForm.get('invoiceNo') as any; }

  get() {
    let prev = 'oops';
    let first = 'oops';
    this.event$ = combineLatest(this._route.params, this._route.queryParams).pipe(
      switchMap(([params, queryParams]) => {
        this.id = +params['id'];
        return this._wf.readEvent(+params['id'], +queryParams['data']);
      }),
      map(res => res[0]),
      map(res => {
        if (res) {
          res['history'].map(hist => {
            hist['prev'] = prev;
            hist['first'] = first;

            prev = hist['time'];
            if (!first || first === 'oops') {
              first = hist['time'];
            }

            return hist;
          });
        }
        return res;
      }),
      tap((info) => {
        if (info) {
          this.deliveryForm.setValue({ workflow_id : this.id, instructions: info.dinstr, user: this.user.user_id, step: 5 });
          this.purchaseForm.setValue({ workflow_id : this.id, instructions: info.pinstr, user: this.user.user_id, step: 6 });
          this.changeInvoiceForm.controls['user'].setValue(this.user.user_id);
          this.changeInvoiceForm.controls['invoiceNo'].setValue(info.invoiceNo);
        }
      })
    );
  }

  moveToGReady(id: number) {
    const object = {
      step: 1,
      workflow_id: id,
      user: this.user.user_id
    };

    if (confirm(`Do you want to move workflow event #${id} to Goods Ready ?`)) {
      this._wf.updateEvent(object).subscribe(
        (data) => {
          this.response = data;
        },
        (err) => {
          this.response = err;
        },
        () => {
          this.get();
          setTimeout(() => this.response = null, 10000);
        }
      );
    } else {
      this.get();
    }
  }

  changeInvNum(id) {
    this.changeInvoiceForm.controls['workflow_id'].setValue(id);
    this._wf.updateEvent(this.changeInvoiceForm.value).subscribe(
      (data) => {
        this.response = data;
      },
      (err) => {
        this.response = err;
      },
      () => {
        this.get();
        setTimeout(() => this.response = null, 10000);
      }
    );
  }

  toggleStatus($event, id) {
    const object = {
      workflow_id: id,
      step: null,
      urgent: $event.target.value,
      user: this.user.user_id
    };

    if ($event.target.name === 'urgent') {
      object.step = 2;
    } else {
      object.step = 3;
    }

    this._wf.updateEvent(object).subscribe(
      (data) => {
        this.response = data;
      },
      (err) => {
        this.response = err;
      },
      () => {
        this.get();
        setTimeout(() => this.response = null, 10000);
      }
    );
  }

  changeInstructions(form: FormGroup) {
    this._wf.updateEvent(form.value).subscribe(
      (data) => {
        this.response = data;
      },
      (err) => {
        this.response = err;
      },
      () => {
        this.get();
        setTimeout(() => this.response = null, 10000);
      }
    );
  }

  editWF(row) {
    this._wf.retrieveProducts(row).subscribe(data => {
      const newdata = data;
      newdata.step = 16;

      this.questions = this._qcs.getQuestions(Number(16), newdata);
    });
  }

  update(id) {
    this.formData.workflow_id = id;
    this.formData.user = this.user.user_id;
    this.formData.step = 16;
    this._wf.changeStatus(this.formData).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.get();
        setTimeout(() => {
          this.formData.status = 0;
        }, 500);
      }
    );
  }

  cancel() {
    this.formData = null;
    setTimeout(() => this.formData.status = 0, 500);
  }

  loadInfo($event: any) {
    this.formData = $event;
  }

}
