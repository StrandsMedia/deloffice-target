import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/common/services/customer.service';
import { ProductService } from 'src/app/common/services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/common/services/auth.service';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  @Input() data: any;
  dataSource$: Observable<any>;

  prodResults: Observable<any>;
  user: any;

  columns = [
    'date',
    'p_id',
    'product',
    'brand',
    'price',
    'validity',
    'notes',
    'user'
  ];

  public newTargetForm: FormGroup = this.fb.group({
    cust_id: null,
    pf_id: null,
    p_id: null,
    pricecat_id: '',
    customprice: null,
    validity_date: null,
    tar_notes: null,
    user: null,
    prod_name: null
  });

  public searchProdForm: FormGroup = this.fb.group({
    search: null
  });

  constructor(
    private auth: AuthService,
    private cust: CustomerService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private prod: ProductService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.dataSource$ = this.cust.getTarget(this.data.cust_id);

    this.newTargetForm.controls['cust_id'].setValue(this.data.cust_id);
    this.newTargetForm.controls['user'].setValue(this.user.user_id);
  }

  insert() {
    this.cust.insertTarget(this.newTargetForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.cancelForm();
      }
    );
  }

  searchProd() {
    this.prodResults = this.prod.search(this.searchProdForm.value.search).pipe(
      map(prods => {
        if (prods.records) {
          return prods.records;
        } else {
          return prods;
        }
      })
    );
  }

  assignProd(data) {
    this.newTargetForm.controls['p_id'].setValue(data.p_id);
    this.newTargetForm.controls['pf_id'].setValue(data.prod_fam);

    this.newTargetForm.controls['prod_name'].setValue(`${data.p_id} - ${data.des3} ${data.des1} ${data.des2}`);

    console.log(this.newTargetForm.value);
  }

  cancelForm() {
    this.newTargetForm.reset();
    this.searchProdForm.reset();
  }

}
