import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';

import { AddComponent } from '../../../views/orders/add/add.component';
import { EditComponent } from '../../../views/orders/edit/edit.component';
import { ViewComponent } from '../../../views/orders/view/view.component';
import { DialogModule } from 'src/app/common/utils/dialog/dialog.module';

const orderroutes: Routes = [
  {
    path: 'view',
    component: ViewComponent
  },
  {
    path: 'new',
    component: AddComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    RouterModule.forChild(orderroutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  declarations: [
    AddComponent,
    EditComponent,
    ViewComponent
  ]
})
export class OrderModule { }
