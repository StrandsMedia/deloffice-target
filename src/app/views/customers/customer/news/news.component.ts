import { Component, OnInit, Input, DoCheck, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { CustomerService } from 'src/app/common/services/customer.service';
import { PrintingService } from 'src/app/common/services/printing.service';
import { WorkflowService } from 'src/app/common/services/workflow.service';
import { TendersService } from 'src/app/common/services/tenders.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { QuestionControlService } from 'src/app/views/workflow/popup/utils/question-control.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, DoCheck {
  @Input() data: any;
  formData: any;
  entries: Observable<any>;
  searchResults: Observable<any>;
  user: any;

  wf_columns = [
    'workflow_id',
    'time',
    'company_name',
    'step',
    'product',
  ];
  pr_columns = [
    'job_id',
    'product',
    'paperspecs',
    'qtyorder',
  ];
  td_columns = [
    'tid',
    'product',
    'estimated_quantity',
    'schedule',
  ];

  prodtype = [
    { id: 'Env', name: 'Envelopes' },
    { id: 'BC', name: 'Business Card' },
    { id: 'LH', name: 'Letterhead' },
    { id: 'CC', name: 'Complimentary Card' },
    { id: 'Brochure', name: 'Brochure' },
    { id: 'Memopad', name: 'Memopad' },
    { id: 'Folder', name: 'Folder' },
    { id: 'Flyer', name: 'Flyer' },
    { id: 'Leaflet', name: 'Leaflet' },
    { id: 'Forms', name: 'Forms' },
    { id: 'Stickers', name: 'Stickers' },
    { id: 'Certificate', name: 'Certificate' },
    { id: 'Voucher', name: 'Voucher' },
    { id: 'Poster', name: 'Poster' },
    { id: 'Booklet', name: 'Booklet' },
    { id: 'Other', name: 'Other' },
  ];

  printwork = [
    { id: 'rectoQuad', name: 'Recto Quad' },
    { id: 'rectoBlack', name: 'Recto Black' },
    { id: 'versoBlack', name: 'Verso Black' },
    { id: 'versoQuad', name: 'Verso Quad' },
    { id: 'Recto/Verso Quad', name: 'Recto/Verso Quad' },
    { id: 'Recto/Verso Black', name: 'Recto/Verso Black' }
  ];

  public searchForm = this.fb.group({
    company_name: ''
  });

  public newPrintForm = this.fb.group({
    custid: null,
    product: null,
    printwork: null,
    startdate: null,
    enddate: null,
    status: null,
    jobdesc: null,
    paperspecs: null,
    filename: null,
    pc: null,
    printer: null,
    printsetting: null,
    qtyorder: null,
    qtyconsumed: null,
    qtycompleted: null,
    qtyrejected: null,
    remarks: null,
    printedby: null,
    supervisedby: null,
    deliverydate: null,
    dimensions: null,
    ppunit: null,
    company_name: null
  });

  public newTenderForm = this.fb.group({
    cust_id: null,
    product: null,
    estimated_quantity: null,
    schedule: null,
    receive_date: null,
    closing_date: null,
    actual_quantity: null,
    delivery: null,
    product_quoted: null,
    price_quoted: null,
    attachment: null,
    comments: null,
    company_name: null
  });
  questions: any[];

  constructor(
    private auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private cust: CustomerService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private print: PrintingService,
    private tender: TendersService,
    private route: ActivatedRoute,
    private router: Router,
    private qcs: QuestionControlService,
    private wf: WorkflowService,
  ) {
    this.auth.currentUser.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.get();
  }

  ngDoCheck() {
    this.cdRef.detectChanges();
  }

  get() {
    this.route.params.forEach((params: Params) => {
      this.entries = this.wf.readByCust(+params['id']);
    });
  }

  trackByFn(item, index) {
    return index;
  }

  search() {
    this.searchResults = this.cust.search(this.searchForm.value.company_name).pipe(
      //
    );
  }

  newPrintEntry() {
    this.print.createPrinting(this.newPrintForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.newPrintForm.reset();
        this.router.navigate(['/printing']);
      }
    );
  }

  newTenderEntry() {
    this.tender.createTender(this.newTenderForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        this.newTenderForm.reset();
        this.router.navigate(['/tenders']);
      }
    );
  }

  lockCust(res) {
    console.log(res);
    this.newPrintForm.controls['custid'].setValue(res.cust_id);
    this.newPrintForm.controls['company_name'].setValue(res.company_name);
  }

  setCust() {
    this.newPrintForm.controls['custid'].setValue(this.data.cust_id);
    this.newPrintForm.controls['company_name'].setValue(this.data.company_name);
  }

  setCust2() {
    this.newTenderForm.controls['cust_id'].setValue(this.data.cust_id);
    this.newTenderForm.controls['company_name'].setValue(this.data.company_name);
  }

  newWF() {
    const object = {
      step: 1
    };
    this.questions = this.qcs.getQuestions(Number(0), object);

  }

  update() {
    this.formData.user = this.user.user_id;
    this.formData.status = +this.formData.status;
    this.formData.cust_id = this.data.cust_id;
    console.log(this.formData);
    this.wf.changeStatus(this.formData).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
        console.log(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
        console.log(err);
      },
      () => {
        this.get();
        setTimeout(() => this.formData.status = 0, 500);
        this.router.navigate(['/workflow/sales']);
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
