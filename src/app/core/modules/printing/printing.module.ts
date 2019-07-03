import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';

import { DialogModule } from '../../../common/utils/dialog/dialog.module';
import { UtilsModule } from '../utils.module';

import { PrintersComponent } from '../../../views/printing/printers/printers.component';
import { PrintingComponent } from '../../../views/printing/printing.component';
import { InkReportComponent } from '../../../views/printing/ink-report/ink-report.component';

const printroutes: Routes = [
  {
    path: '',
    redirectTo: '/printing/overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: PrintingComponent,
    data: {
      title: 'Printing',
      id: 6
    }
  },
  {
    path: 'printers',
    component: PrintersComponent,
    data: {
      title: 'Printers',
      id: 6
    }
  },
  {
    path: 'ink-report',
    component: InkReportComponent,
    data: {
      title: 'Ink Usage Report',
      id: 6
    }
  }
];

@NgModule({
  declarations: [
    PrintersComponent,
    PrintingComponent,
    InkReportComponent
  ],
  imports: [
    CommonModule,
    CdkTableModule,
    RouterModule.forChild(printroutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    UtilsModule
  ]
})
export class PrintingModule { }
