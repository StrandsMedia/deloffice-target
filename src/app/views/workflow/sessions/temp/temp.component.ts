import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { WorkflowService } from '../../../../common/services/workflow.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.scss']
})
export class TempComponent implements OnInit {
  dataSource$: Observable<any>;
  asc = true;
  clicked = 0;
  loading = false;
  user: any;
  columns = [
    'jobid',
    'date',
    'type',
    'vehicle',
    'invoices',
    'close'
  ];

  vehicles = [
    '4730 ZR 01',
    '5271 ZR 02',
    '629 MR 03',
    '3213 ZU 04',
    '3652 ZT 04',
    '2772 ZV 05',
    '5027 ZR 06'
  ];

  public closeSessionForm: FormGroup = this.fb.group({
    vehicle: ['', Validators.required],
    driver: [null, Validators.required],
    user: [null],
    sessionID: [null],
    region: null
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private wf: WorkflowService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.get();
    this.closeSessionForm.controls['user'].setValue(+this.user.user_id);
  }

  get() {
    return this.dataSource$ = this.wf.sessionRead(1).pipe(
      // map((data: any) => {
      //   return data.records;
      // }),
      tap((data) => {
        this.loading = false;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  assignSession(id) {
    this.closeSessionForm.controls['sessionID'].setValue(+id);
  }

  closeSession() {
    console.log(this.closeSessionForm.value);
    this.wf.closeSession(this.closeSessionForm.value).subscribe(
      (dt) => {
        console.log(dt);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.get();
        this.closeSessionForm.reset();
      }
    );
  }

}
