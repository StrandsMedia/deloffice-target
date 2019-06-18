import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth.service';
import { MaterialService } from 'src/app/common/services/material.service';
import { ProductService } from 'src/app/common/services/product.service';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, DoCheck {
  public imgUrl = environment.imgUrl;
  categories: Observable<any>;
  products: Observable<any>;
  list: any;
  selected = { id: null, cat: null };
  mode = 1;
  selprod: any = null;
  prodedit: any = null;

  formData: any = {valid: false};
  user: any;

  public searchProdForm: FormGroup = this.fb.group({
    searchprod: [null, Validators.required],
    mode: this.mode
  });

  constructor(
    private auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private prod: ProductService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.categories = this.prod.getCategories();
  }

  ngDoCheck() {
    this.cdRef.detectChanges();
  }

  trackByFn(index, item) {
    return index;
  }

  initList() {
    this.list = this.mdc.materialList();
  }

  loadProd(prod) {
    this.selprod = this.prod.getProdById(prod.p_id);
  }

  editProd(prod) {
    this.prodedit = this.prod.getFullProdById(prod.p_id);
  }

  assignID(row, $event) {
    $event.preventDefault();
    if (!row.subcat || row.last === 'Y') {
      const id = $event.target.getAttribute('name');
      this.selected.id = +id;
      this.selected.cat = row.cat;
      this.get();
    }
  }

  get() {
    this.products = this.prod.getProdByCat(this.selected.id, this.selected.cat, this.mode);
  }

  cancel() {
    this.prodedit = null;
    this.selprod = null;
  }

  search() {
    this.searchProdForm.controls['mode'].setValue(this.mode);
    this.products = this.prod.getProdByName(this.searchProdForm.value);
  }

  changeMode() {
    this.mode = +this.searchProdForm.value.mode;
  }

  updateData($event) {
    this.formData = $event;
  }

  updateForm() {
    this.prod.updateProd(this.formData).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

  insertProd() {
    this.prod.insertProd(this.formData).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }

}
