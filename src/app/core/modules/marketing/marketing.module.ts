import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';

import { UtilsModule } from '../utils.module';
import { MarketingOverviewComponent } from '../../../views/marketing/marketing-overview/marketing-overview.component';

const mktroutes: Routes = [
  {
    path: 'overview',
    component: MarketingOverviewComponent,
    data: {
      title: 'Marketing Overview',
      id: 18
    }
  }
];

@NgModule({
  declarations: [
    MarketingOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(mktroutes),
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    UtilsModule
  ]
})
export class MarketingModule { }
