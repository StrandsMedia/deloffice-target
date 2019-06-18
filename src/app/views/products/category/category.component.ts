import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProductService } from '../../../common/services/product.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public category$: Observable<any>;

  public loading: boolean;
  public catselect = {
    category: null,
    category2: null,
    category3: null,
    category4: null
  };
  public catid: null;
  public catarr = [];
  public newCatForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _prod: ProductService
  ) { }

  ngOnInit(): void {
    this.get();
  }

  public get(): void {
    this.category$ = this._prod.getCategoriesIrr();
  }

  public trackByFn(index, item) {
    return index;
  }

  boundArr(arr: any[]): any[] | null {
    switch (this.catid) {
      case 1:
        return null;
      case 2:
        return (arr['category'] as any[]);
      case 3:
        return (arr['category2'] as any[]);
      case 4:
        return (arr['category3'] as any[]);
    }
  }

  generateForm() {
    const group: any = {};

    if (this.catselect) {
      //
    }

    return this.newCatForm = this._fb.group(group);
  }

}
