import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth.service';
import { CustomerService } from 'src/app/common/services/customer.service';
import { DebtorsService } from 'src/app/common/services/debtors.service';
import { MaterialService } from '../../../common/services/material.service';
import { chunkArray, image, dada, tableToJSPDFData } from 'src/app/common/interfaces/letterhead';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit, AfterViewInit {
  tabbar: any;
  tabselect = 'collect';
  status = 0;
  row: any;
  user: any;
  summ_array: Array<any> = [];
  whole_arr: Array<any> = [];

  dataSource$: Observable<any>;
  searchResults: Observable<any>;

  columns = [
    'id',
    'createdAt',
    'customer',
    'region',
    'payment',
    'delivery',
    'collected',
    'amount',
    'comment',
    'complete',
    'batchtick'
  ];

  public statusChange = this.fb.group({
    status: this.status
  });

  public addCollectForm = this.fb.group({
    cust_id: null,
    company_name: null,
    pay_method: 1,
    delivery_pay: null,
    comment: null,
    data: null,
    user: null,
    username: null,
    type: 0,
    amount: null,
    remarks: null,
    region: 'North'
  });

  public pickCustForm = this.fb.group({
    custsearch: null,
    data: 1
  });

  public collectForm = this.fb.group({
    collected: null,
    comment: null
  });

  public tabs = [
    { name: 'collect', fullname: 'Collect Entries' },
    { name: 'post', fullname: 'Post Entries' },
    { name: 'transfer', fullname: 'Transfer Entries' }
  ];

  constructor(
    private auth: AuthService,
    private cust: CustomerService,
    private dbt: DebtorsService,
    private fb: FormBuilder,
    private mdc: MaterialService
  ) {
    auth.currentUser.subscribe((data) => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  ngAfterViewInit() {
    this.initTab();
  }

  get() {
    let type;
    switch (this.tabselect) {
      case 'collect':
        type = 0;
        break;
      case 'post':
        type = 1;
        break;
      case 'transfer':
        type = 2;
        break;
    }
    this.dataSource$ = this.dbt.readEntries(this.status, type).pipe(
      map((data: any) => data.records),
      tap((data) => this.whole_arr = data)
    );
  }

  update() {
    this.status = +this.statusChange.value.status;
    this.get();
  }

  update2(value: string) {
    this.tabselect = value;
    this.get();
  }

  search() {
    this.searchResults = this.cust.searchCust(this.pickCustForm.value.custsearch, this.pickCustForm.value.data);
  }

  insert() {
    const delivery_pay = this.addCollectForm.value.delivery_pay;
    // tslint:disable-next-line:triple-equals
    this.addCollectForm.controls['delivery_pay'].setValue(delivery_pay == 1 ? 1 : 0);
    this.dbt.insertEntry(this.addCollectForm.value).subscribe(
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
        this.cancel();
      }
    );
  }

  cancel() {
    this.addCollectForm.reset();
    this.pickCustForm.reset();
  }

  collect() {
    let object;
    const array = [];
    if (this.summ_array.length > 0) {
      this.summ_array.forEach(item => {
        const temp_obj = {
          debt_id: +item.debt_id,
          cust_id: +item.cust_id,
          company_name: item.company_name,
          user: +this.user.user_id,
          username: this.user.username,
          collected: this.collectForm.value.collected ? 1 : 0,
          comment: this.collectForm.value.comment,
          date: dada(),
          data: +item.data
        };
        array.push(temp_obj);
      });
    } else {
      object = {
        debt_id: +this.row.debt_id,
        cust_id: +this.row.cust_id,
        company_name: this.row.company_name,
        user: +this.user.user_id,
        username: this.user.username,
        collected: this.collectForm.value.collected ? 1 : 0,
        comment: this.collectForm.value.comment,
        date: dada(),
        data: +this.row.data
      };
      array.push(object);
    }

    console.log(array);

    this.dbt.markCollected(array).subscribe(
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
        this.summ_array = [];
      }
    );
  }

  public parsePayMethod(value: string) {
    switch (+value) {
      case 0:
        return 'Cash';
        break;
      case 1:
        return 'Cheque';
        break;
      case 2:
        return 'Cheque/Cash';
        break;
    }
  }

  public parseDeliveryPay(value: string) {
    if (value == '0') {
      return 'No';
    }
    return 'Yes';
  }

  assign(id) {
    this.row = id;
  }

  lockCust(res) {
    this.addCollectForm.controls['cust_id'].setValue(res.cust_id);
    this.addCollectForm.controls['company_name'].setValue(res.company_name);
    this.addCollectForm.controls['remarks'].setValue(res.address);
    this.addCollectForm.controls['data'].setValue(this.pickCustForm.value.data ? this.pickCustForm.value.data : 1);
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

  printSummary() {
    const pdf = new jsPDF('l', 'pt', 'a4');
    const firstres = tableToJSPDFData('#firsttable');
    const result = chunkArray(firstres.body, 16);
    const title = 'DEBT COLLECTION - PRINT SUMMARY';

    for (let i = 0; i < result.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      (pdf as any).autoTable({
        head: firstres.head,
        body: result[i],
        theme: 'grid',
        styles: {
          fontSize: 9.2,
          overflow: 'linebreak',
          lineColor: 100,
          lineWidth: 0.2,
          textColor: 0,
          valign: 'top',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 150 },
          1: { cellWidth: 260 },
          2: { cellWidth: 100 },
          3: { cellWidth: 100 },
          4: { cellWidth: 100 },
          5: { cellWidth: 100 }
        },
        headStyles: {
          fillColor: false,
          textColor: 0
        },
        tableWidth: 'auto',
        tableLineColor: 0,
        margin: {
          top: 80,
          left: 15,
          bottom: 25,
          right: 15
        },
        // pageBreak: 'always',
        didDrawPage: function(data) {
          pdf.addImage(image('DEL'), 'JPEG', 16, 18, 160, 33);
          pdf.text(title, 15, 67);
        }
      });
    }

    pdf.save(`collect_sum_${new Date().toISOString().split('T')[0].split('-').reverse().join('')}.pdf`);
    this.summ_array = [];
  }

  pushToArr($event, value) {
    if ($event.target.checked) {
      if (!this.summ_array.includes(value)) {
        this.summ_array.push(value);
      }
    } else {
      if (this.summ_array.includes(value)) {
        this.summ_array.forEach((id, index) => {
          if (id.debt_id === value.debt_id) {
            this.summ_array.splice(index, 1);
          }
        });
      }
    }
    this.summ_array = this.sortArr(this.summ_array);
    console.log(this.summ_array);
  }

  sortArr(arr: Array<any>) {
    const sorted = arr.sort((a, b) => {
      if (a.region < b.region) {
        return -1;
      }
      if (a.region > b.region) {
          return 1;
      }
      return 0;
    });
    return sorted;
  }

}
