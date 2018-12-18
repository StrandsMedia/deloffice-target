import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AllocsComponent } from '../../../views/debtors/allocs/allocs.component';
import { CollectComponent } from '../../../views/debtors/collect/collect.component';
import { ControlComponent } from '../../../views/debtors/control/control.component';
import { DialogModule } from 'src/app/common/utils/dialog/dialog.module';

const debtroutes: Routes = [
  { path: 'allocations', component: AllocsComponent },
  { path: 'collect', component: CollectComponent },
  { path: 'control', component: ControlComponent }
];

@NgModule({
  declarations: [AllocsComponent, CollectComponent, ControlComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(debtroutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class DebtorsModule { }
