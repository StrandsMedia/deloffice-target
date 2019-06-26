import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';

import { AddComponent } from '../../../views/orders/add/add.component';
import { EditComponent } from '../../../views/orders/edit/edit.component';
import { ViewComponent } from '../../../views/orders/view/view.component';
import { DialogModule } from 'src/app/common/utils/dialog/dialog.module';
import { UtilsModule } from '../utils.module';
import { ViewGPComponent } from '../../../views/orders/view-gp/view-gp.component';
import { PurgatoryComponent } from '../../../views/purgatory/purgatory.component';

const orderroutes: Routes = [
  {
    path: 'view',
    children: [
      {
        path: '',
        component: ViewComponent,
        data: {
          title: 'View Invoices',
          id: 3
        }
      },
      {
        path: ':id/gp',
        component: ViewGPComponent,
        data: {
          title: 'Goods Preparation List',
          id: 3
        }
      },
      {
        path: ':id',
        component: EditComponent,
        data: {
          title: 'Edit Invoice',
          id: 3
        }
      },
     
    ],
    data: {
      expectedRole: ['Admin'],
      id: 3
    }
  },
  {
    path: 'new',
    component: AddComponent,
    data: {
      title: 'New Invoice',
      expectedRole: ['Admin'],
      id: 3
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    RouterModule.forChild(orderroutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    UtilsModule
  ],
  declarations: [
    AddComponent,
    EditComponent,
    ViewComponent,
    ViewGPComponent,
    PurgatoryComponent
  ]
})
export class OrderModule { }
