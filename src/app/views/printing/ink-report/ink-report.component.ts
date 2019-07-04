import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

import { PrintingService } from 'src/app/common/services/printing.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ink-report',
  templateUrl: './ink-report.component.html',
  styleUrls: ['./ink-report.component.scss']
})
export class InkReportComponent implements OnInit {
  loading: boolean;
  dataSource$: Observable<any>;
  ink_report: Observable<any>;
  printers: Observable<any>;

  columns = [
    'reportId',
    'printerId',
    'inkChangedType',
    'createdAt',
    'updatedAt'
  ];

  public searchForm = this.fb.group({
    ink_report: ['']
  });

  public addForm = this.fb.group({
    printerId: [null, Validators.required],
    inkChangedType: [null, Validators.required],
    createdAt: null
  });

  constructor(
    private fb: FormBuilder,
    private print: PrintingService
  ) { 
    this.printers = this.print.getPrinters().pipe(
      map(res => res.records)
    );
  }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    return this.dataSource$ = this.print.getEntries().pipe(
      map(res => res.records)
    );
  }

  addNew() {
    this.print.createEntries(this.addForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.get();
      }
    );
  }
}
