import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

import { PrintingService } from 'src/app/common/services/printing.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss']
})
export class PrintersComponent implements OnInit {
  loading: boolean;
  dataSource$: Observable<any>;
  printer: Observable<any>;

  columns = [
    'printerId',
    'printerName',
    'active',
    'createdAt',
    'updatedAt'
  ];

  public searchForm = this.fb.group({
    printer: ['']
  });

  public addForm = this.fb.group({
    printerName: null,
    active: null
  });

  constructor(
    private fb: FormBuilder,
    private print: PrintingService
  ) { }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    return this.dataSource$ = this.print.getPrinters().pipe(
      map(res => res.records)
    );
  }

  addNew() {
    this.print.createPrinter(this.addForm.value).subscribe(
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