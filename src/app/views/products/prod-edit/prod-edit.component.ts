import { Component, OnInit, OnChanges, DoCheck, Input, Output, EventEmitter } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProductService } from 'src/app/common/services/product.service';
import { MaterialService } from 'src/app/common/services/material.service';

import { validateFormat } from '../image-data';

@Component({
  selector: 'app-prod-edit',
  templateUrl: './prod-edit.component.html',
  styleUrls: ['./prod-edit.component.scss']
})
export class ProdEditComponent implements OnInit, OnChanges, DoCheck {
  public imgUrl = environment.imgUrl;
  @Input() data: Observable<any>;
  @Output() update = new EventEmitter<any>();
  categories: Observable<any>;
  newdata: Observable<any>;

  payLoad: any;
  filename = 'Choose file...';
  selectedFile: File = null;
  loading = false;

  public status = 1;

  public prodEditForm: FormGroup = this.fb.group({
    p_id: null,
    des1: null,
    des2: null,
    des3: null,
    deslong1: null,
    deslong2: null,
    deslong3: null,
    deslong4: null,
    deslong5: null,
    deslong6: null,
    deslong7: null,
    pf_cat_id: null,
    category2: null,
    category3: null,
    category4: null,
    avgcost: null,
    puprice: null,
    coprice: null,
    wsprice: null,
    delcityprice: null,
    delcitypromo: null,
    spprice: null,
    taxcode: null,
    visible: null
  });

  constructor(
    private fb: FormBuilder,
    private mdc: MaterialService,
    private prod: ProductService
  ) { }

  ngOnInit() {
    this.get();
    this.categories = this.prod.getCategories();
  }

  ngDoCheck() {
    if (this.prodEditForm.value !== this.payLoad) {
      this.updateForm();
    }
  }

  ngOnChanges() {
    this.payLoad = this.prodEditForm.value;
  }

  get f() { return this.prodEditForm.controls; }

  get() {
    return this.newdata = this.data.pipe(
      map(dt => {
        return dt;
      }),
      tap(v => {
        this.prodEditForm.setValue(v);
      })
    );
  }

  updateForm() {
    this.update.emit(this.prodEditForm.value);
  }

  loadFile($event) {
    this.selectedFile = <File>$event.target.files[0];
    if (validateFormat(this.selectedFile)) {
      this.filename = this.selectedFile.name;
      if (FileReader) {
        const fr = new FileReader();
        fr.onload = function() {
          const img = document.getElementById('picture');
          if (img) {
            (img as any).src = fr.result;
          }
        };
        fr.readAsDataURL(this.selectedFile);
      }
    } else {
      this.selectedFile = null;
    }
  }

  onUpload() {
    this.loading = true;
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);

    this.prod.uploadFile(fd).subscribe(
      (data) => {
        if (data.type === HttpEventType.Response) {
          this.mdc.materialSnackBar(data.body);
        }
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.loading = false;
      }
    );
  }

}
