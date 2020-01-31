import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import { CustomerService } from '../../../common/services/customer.service';
import { OrdersService } from '../../../common/services/orders.service';
import { MaterialService } from '../../../common/services/material.service';
import { ProductService } from '../../../common/services/product.service';
import { ConfirmService } from '../../../common/services/confirm.service';
import { PurgatoryService } from 'src/app/common/services/purgatory.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { renderInvoice, printInv } from '../orders.utils';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public imgUrl = environment.imgUrl;

  dataSource$: Observable<any>;
  product$: Observable<any>;
  prodCode$: Observable<any>;
  loading = false;
  view = true;

  public selectedIndex;

  entries = [];
  private _prodEntr$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public prodEnt$: Observable<any> = this._prodEntr$.asObservable();
  public tempProd: any;

  private _tempData: any;
  public tempData: any;
  stable = [];
  public changed: boolean = false;

  public priceCategories = [
    'PP',
    'CP1',
    'CP2',
    'WP',
    'TP',
    'DP',
    'OTH'
  ]

  boundProd: any;

  postData: any = {};

  filteredResults: Observable<any>;
  public columns = [
    'p_id',
    'des',
    'brand',
    'stock',
    'qty',
    'pricecat',
    'invprice',
    'totalexcl',
    'vat',
    'totalincl',
    'edit',
    'defprice',
    'sprice',
    'cprice',
    'uprofit',
    'tprofit',
    'pprofit'
  ];

  public searchForm = this._fb.group({
    company_name: null
  });

  public searchProdForm: FormGroup = this._fb.group({
    cust_id: [null, Validators.required],
    prodsearch: null
  });

  public searchProdForm2: FormGroup = this._fb.group({
    cust_id: [null, Validators.required],
    prodsearch: null
  });

  public addProdForm: FormGroup = this._fb.group({
    p_id: null,
    StockLink: null,
    Description_1: null,
    Description_2: null,
    Description_3: null,
    Qty_On_Hand: null,
    fExclPrice: null,
    fExclPrice2: null,
    qty: null,
    AveUCst: null,
    TaxRate: null,
    idTaxRate: null,
    status: null,
    pricecat: null
  });

  public editForm: FormGroup = this._fb.group({
    note: null
  });

  public sendMail = this._fb.group({
    email: [null, Validators.required],
    subject: [null, Validators.required],
    message: [null, Validators.required],
    attachment: null
  });
  type = 1;

  constructor(
    private _confirm: ConfirmService,
    private _cust: CustomerService,
    private _fb: FormBuilder,
    private _mdc: MaterialService,
    private _order: OrdersService,
    private _prod: ProductService,
    private _purgatory: PurgatoryService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.get();
  }

  public convertNum(item: string | number) {
    const idx = ('000000' + (+(item) + 1)).slice(-6);
    return 'No. '+idx;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.changed) {
      return this._confirm.confirm('Do you want to save before you exit?').pipe(
        tap(v => {
          if (v) {
            this.savePDF()
          }
        })
      )
    } else {
      return true;
    }
  }

  get() {
    this.loading = true;
    this.dataSource$ = this._route.params.pipe(
      map(params => params.id),
      switchMap(params => {
        return this._order.getInvoice(+params);
      }),
      map((res: any) => res.records[0]),
      tap((res) => {
        this._tempData = res;
        this.tempData = res;
        console.log(res)
        this.searchProdForm.controls['cust_id'].setValue(res.cust_id);
        this.searchProdForm2.controls['cust_id'].setValue(res.cust_id);
        this.entries = res.entries;

        this.entries.forEach(entry => {
          entry.status = 'existing';
        });

        this._prodEntr$.next(this.entries);

        this.loading = !this.loading;
      })
    );
  }

  public trackByFn(index, item) {
    return index;
  }

  public bindProduct(row, data) {
    const obj = {
      workflow_id: data.workflow_id,
      cust_id: data.cust_id,
      data: data.data,
      p_id: row.p_id,
      qty: row.qty,
      type: this.type,
      invlineid: row.invlineid
    }

    console.log(obj)
    this.boundProd = obj;
  }

  requestProd() {
    this._purgatory.createPurchasing(this.boundProd)
    .pipe(

    )
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.boundProd = null;
      }
    )
  }

  searchProd() {
    this.product$ = this._prod.searchAdv(this.searchProdForm.value).pipe(
      map((res: any) => res.records)
    );
  }

  altSearchProd() {
    this.prodCode$ = this._prod.searchOneAdv(this.searchProdForm2.value).pipe(
      map((res: any) => res.records),
      tap((res) => this.tempProd = res[0])
    );
  }

  resetDoc() {
    this.entries = this.stable;
  }

  removeFromList(index) {
    const entries = this._prodEntr$.value;
    const entryStatus = entries[index]['status'];

    switch (entryStatus) {
      case 'existing':
        entries[index]['status'] = 'delete';
        break;
      case 'new':
        entries.splice(index, 1);
        break;
      default:
        entries[index]['status'] = 'existing';
        break;
    }

    this.changed = true;

    this._prodEntr$.next(entries);
  }

  toggleView() {
    this.view = !this.view;
  }

  updateVal(index, event) {
    const entries = this._prodEntr$.value;
    let newval = event.target.value;
    const field = event.target.id;
    if (field === 'fExclPrice') {
      newval = parseFloat(newval).toFixed(2);

      const priceMatch = Object.values(entries[index]['prices'])
        .map((entry, idx) => {
          if (+newval == entry) {
            return idx;
          }
        })
        .filter((entry) => {
          if (entry) {
            return entry
          }
        })

      if (priceMatch.length > 0) {
        entries[index]['pricecat'] = this.priceCategories[priceMatch[0]];
      } else {
        // Switch Pricecat to OTH
  
        entries[index]['pricecat'] = "OTH";
      }

    }
    entries[index][field] = newval;

    this.changed = true;

    this._prodEntr$.next(entries);
  }

  updatePriceSelect(row, $event) {
    const idx = $event.target.selectedIndex;
    const val = this.priceCategories[idx]
    row['fExclPrice'] = (+row.prices[val]).toFixed(2);
    row['pricecat'] = val;
  }

  public disablePrice(row, item) {
    if (row.prices[item] == null || row.prices[item] == undefined || row.prices[item] == 0) {
      return true;
    } else {
      return false;
    }
  }

  addToTemp(prod: any = this.tempProd, qty = 1) {
    console.log(prod);
    const tempArray = this._prodEntr$.value;

    if (!this._isInArr(prod)) {
      prod.qty = qty;
      prod.fExclPrice = +prod.fExclPrice;
      prod.fExclPrice2 = +prod.fExclPrice;
      prod.status = 'new';
      tempArray.push(prod);

      this.changed = true;

      this._prodEntr$.next(tempArray);
    } else {
      alert('Product already exists in document');
    }
  }

  addToTempEnter($event) {
    if ($event.key === 'Enter') {
      this.addToTemp();
      
    }
  }

  // Utils

  private _isInArr(prod: any = this.tempProd): boolean {
    const tempArray: any[] = this._prodEntr$.value;
    return tempArray.reduce((acc, curr) => {
      if (curr.p_id == prod.p_id) {
        return true;
      } else {
        return false;
      }
    }, false);
  }

  public totalexcl() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + (+curr.fExclPrice * +curr.qty), 0);
  }

  public totalvat() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + ((+curr.fExclPrice * (+curr.TaxRate / 100)) * +curr.qty), 0);
  }

  public totalincl() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + ((+curr.fExclPrice * ((+curr.TaxRate / 100) + 1)) * +curr.qty), 0);
  }

  public totalprofit() {
    const prodArr = this._prodEntr$.value;
    return prodArr.reduce((acc, curr) => acc + ((+curr.fExclPrice - +curr.AveUCst) * +curr.qty), 0);
  }

  public get arrLength(): number {
    const prodArr = this._prodEntr$.value;
    return prodArr.length;
  }

  // PDF Utils

  viewPDF() {
    const pdf = renderInvoice(this._tempData);
    // pdf.output('dataurlnewwindow', { filename: 'newpdf.pdf' });
    printInv(pdf);
  }

  saveQuote() {
    const prodArr = this._prodEntr$.value;
    this._tempData.entries = prodArr;
    this._tempData.TotalExcl = this.totalexcl();
    this._tempData.TotalTax = this.totalvat();
    this._tempData.TotalIncl = this.totalincl();

    console.log(this._tempData);
    this._order.updateInvoice(this._tempData)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.changed = false;
        const pdf = renderInvoice(this._tempData, 'Quotation');
        printInv(pdf);
      }
    )
  }

  savePDF() {
    const prodArr = this._prodEntr$.value;
    this._tempData.entries = prodArr;
    this._tempData.TotalExcl = this.totalexcl();
    this._tempData.TotalTax = this.totalvat();
    this._tempData.TotalIncl = this.totalincl();

    console.log(this._tempData);
    this._order.updateInvoice(this._tempData)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.changed = false;
      }
    )
  }

  processPDF(option: string) {
    const prodArr = this._prodEntr$.value;
    this._tempData.entries = prodArr;
    this._tempData.status = option;
    this._tempData.TotalExcl = this.totalexcl();
    this._tempData.TotalTax = this.totalvat();
    this._tempData.TotalIncl = this.totalincl();

    this._tempData.note = this.editForm.value.note;
    if (option == 'cancel') {
      if (this.editForm.value.note == '' || this.editForm.value.note == null) {
        const noNote = prompt('Please type in a line note for cancellation')
        if (noNote) {
          this._tempData.note = noNote;
        }
      }
    }

    this._order.processInvoice(this._tempData)
    .subscribe(
      (data) => {
        this._mdc.materialSnackBar(data);
      },
      (err) => {
        this._mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.changed = false;
        this._router.navigate(['/workflow/proforma']);
      }
    )
  }
}
