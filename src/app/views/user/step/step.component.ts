import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/common/services/auth.service';
import { WorkflowService } from 'src/app/common/services/workflow.service';

import { Observable, from, of } from 'rxjs';
import { tap, map, switchMap, filter } from 'rxjs/operators';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
  dataSource$: Observable<any>;
  wfSteps: Observable<any>;

  loading = false;
  datapresence = false;
  selected: any = null;
  user: any;

  public searchInvoiceForm: FormGroup = this.fb.group({
    searchstring: [null, Validators.required]
  });

  public changeStepForm: FormGroup = this.fb.group({
    step: ['', Validators.required],
    workflow_id: [null, Validators.required],
    comment: null,
    user: [null, Validators.required]
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private route: ActivatedRoute,
    private router: Router,
    private wf: WorkflowService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.getSteps();
    this.route.queryParams.pipe(
      tap((params) => {
        if (params.inv) {
          this.getData();
        }
      })
    ).subscribe();
  }

  search() {
    this.router.navigate(['/users/step'], {
      queryParams: {
        inv: this.searchInvoiceForm.value.searchstring
      }
    })
    .then((success) => this.getData())
    .catch((err) => this.mdc.materialSnackBar(err.error));
  }

  getData() {
    this.loading = true;
    this.datapresence = false;

    this.dataSource$ = this.route.queryParams.pipe(
      filter(params => params.inv),
      switchMap((param) => {
        if (param.inv) {
          this.searchInvoiceForm.controls['searchstring'].setValue(param.inv);
          return this.wf.searchInvoice(param.inv);
        } else {
          return of(null);
        }
      }),
      map(res => {
        if (res) {
          return res[0];
        }
        return null;
      }),
      tap((v) => {
        if (v) {
          this.datapresence = true;
          this.loading = false;
          this.changeStepForm.controls['workflow_id'].setValue(v.workflow_id);
          this.changeStepForm.controls['user'].setValue(this.user.user_id);
        }
      })
    );
  }

  getSteps() {
    this.wfSteps = this.wf.readSteps().pipe(
      map(res => res.records)
    );
  }

  cancelForm() {
    this.changeStepForm.reset();
  }

  overrideStep() {
    this.wf.overrideStep(this.changeStepForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.datapresence = false;
        this.searchInvoiceForm.reset();
        this.changeStepForm.reset();
        this.selected = null;
      }
    );
  }

}
