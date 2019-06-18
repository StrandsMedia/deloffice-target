import { Component, OnInit, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';

import { ProductService } from 'src/app/common/services/product.service';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/common/utils/validation.errors';
import { MaterialService } from 'src/app/common/services/material.service';

import { Observable } from 'rxjs';
import { debounceTime, map, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-prod-add',
  templateUrl: './prod-add.component.html',
  styleUrls: ['./prod-add.component.scss']
})
export class ProdAddComponent implements OnInit, OnChanges, DoCheck {
  @Output() update = new EventEmitter<any>();

  categories: Observable<any>;

  payLoad: any;
  filename = 'Choose file...';
  selectedFile: File = null;
  form: any;

  loading = false;

  public status = 1;

  public prodAddForm: FormGroup = this.fb.group({
    p_id: [
      null,
      [Validators.required],
      [prodChecker(this.prod)]
    ],
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
    visible: [null, Validators.required]
  });
  errors: any;

  constructor(
    private fb: FormBuilder,
    private mdc: MaterialService,
    private prod: ProductService
  ) { }

  ngOnInit() {
    this.categories = this.prod.getCategories();
  }

  ngDoCheck() {
    if (this.prodAddForm.value !== this.payLoad) {
      this.updateForm();
    }
    if (this.prodAddForm) {
      if (!this.prodAddForm.valid) {
        const error: AllValidationErrors = getFormValidationErrors(this.prodAddForm.controls).shift();
        if (error) {
          let text;
          switch (error.error_name) {
            case 'required': text = `${error.control_name} is required!`; break;
            case 'pattern': text = `${error.control_name} has wrong pattern!`; break;
            case 'email': text = `${error.control_name} has wrong email format!`; break;
            case 'areEqual': text = `${error.control_name} must be equal!`; break;
            case 'exists': text = `${error.control_name} already exists!`; break;
            default: text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;
          }
          this.errors = text;
        } else {
          this.errors = null;
        }
      } else {
        this.errors = null;
      }
    }
  }

  ngOnChanges() {
    this.payLoad = this.prodAddForm.value;
  }

  get f() { return this.prodAddForm.controls; }

  updateForm() {
    this.form = this.prodAddForm.value;
    this.form.valid = this.prodAddForm.valid;
    this.update.emit(this.prodAddForm.value);
  }

  loadFile($event) {
    this.selectedFile = <File>$event.target.files[0];
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

export function prodChecker(prod?: ProductService): AsyncValidatorFn {
  return (ctrl: AbstractControl): Observable<{exists: boolean} | null> => {
      const id = ((ctrl.value) as string).toLowerCase();
      if (id) {
          return prod.duplicateCheck(id).pipe(
              throttleTime(2000),
              map((res: any) => (res.result ? { exists: true } : null))
          );
      }
  };
}
