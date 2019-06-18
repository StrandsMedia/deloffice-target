import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';
import { DialogModule } from '../../../common/utils/dialog/dialog.module';
import { UtilsModule } from '../utils.module';

import { ProductsComponent } from '../../../views/products/products.component';
import { CategoryComponent } from '../../../views/products/category/category.component';
import { ProdAddComponent } from '../../../views/products/prod-add/prod-add.component';
import { ProdEditComponent } from '../../../views/products/prod-edit/prod-edit.component';

const prodroutes: Routes = [
  {
    path: 'view',
    component: ProductsComponent,
    data: {
      title: 'Products',
      id: 7
    }
  },
  {
    path: 'category',
    component: CategoryComponent,
    data: {
      title: 'Product Categories',
      id: 7
    }
  }
];

@NgModule({
  declarations: [
    ProductsComponent,
    CategoryComponent,
    ProdAddComponent,
    ProdEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(prodroutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CdkTableModule,
    UtilsModule
  ]
})
export class ProductModule { }
