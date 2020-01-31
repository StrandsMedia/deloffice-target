import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';

import { AllocsComponent } from '../../../views/debtors/allocs/allocs.component';
import { CollectComponent } from '../../../views/debtors/collect/collect.component';
import { ControlComponent } from '../../../views/debtors/control/control.component';
import { DialogModule } from '../../../common/utils/dialog/dialog.module';
import { SingleComponent } from '../../../views/debtors/control/single/single.component';
import { ReminderComponent } from '../../../views/debtors/reminder/reminder.component';
import { UtilsModule } from '../utils.module';
import { PopupComponent } from '../../../views/debtors/control/popup/popup.component';
import { PopquesComponent } from '../../../views/debtors/control/popques/popques.component';
import { RemPipe } from '../../../views/debtors/control/rem.pipe';
import { ReviewComponent } from '../../../views/debtors/review/review.component';
import { CreditComponent } from '../../../views/debtors/credit/credit.component';

const debtroutes: Routes = [
  {
    path: 'allocations',
    component: AllocsComponent,
    data: {
      title: 'Allocations',
      expectedRole: ['Accounting'],
      id: 13
    }
  },
  {
    path: 'collect',
    component: CollectComponent,
    data: {
      title: 'Debt Collection',
      expectedRole: ['Accounting'],
      id: 14
    }
  },
  {
    path: 'control',
    children: [
      {
        path: '',
        component: ControlComponent,
        data: {
          title: 'Debtors Chasing',
          id: 15
        }
      },
      {
        path: ':id',
        component: SingleComponent,
        data: {
          title: 'Debtors Chasing',
          id: 15
        }
      }
    ],
    data: {
      expectedRole: ['Accounting'],
      id: 15
    }
  },
  {
    path: 'reminder',
    component: ReminderComponent,
    data: {
      title: 'Reminders Module',
      expectedRole: ['Accounting'],
      id: 16
    }
  },
  {
    path: 'review',
    component: ReviewComponent,
    data: {
      title: 'My Review',
      expectedRole: ['Accounting'],
      id: 17
    }
  },
  {
    path: 'credit-control',
    component: CreditComponent,
    data: {
      title: 'Credit Control Gateway',
      expectedRole: ['Accounting'],
      id: 15
    }
  }
];

@NgModule({
  declarations: [
    AllocsComponent,
    CollectComponent,
    ControlComponent,
    SingleComponent,
    ReminderComponent,
    PopupComponent,
    PopquesComponent,
    RemPipe,
    ReviewComponent,
    CreditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(debtroutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CdkTableModule,
    UtilsModule
  ]
})
export class DebtorsModule { }
