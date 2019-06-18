import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReversePipe } from 'src/app/common/pipes/reverse.pipe';
import { SeshPipe } from '../../common/pipes/sesh.pipe';
import { DynamicComponentDirective } from 'src/app/common/utils/dynamic.component.directive';
import { DaydiffPipe } from 'src/app/common/pipes/daydiff.pipe';
import { FilterPipe } from 'src/app/common/pipes/filter.pipe';
import { VehicleDirective } from 'src/app/common/utils/vehicle.directive';

import { NewDatePipe } from 'src/app/common/pipes/date.pipe';
import { DatePipe } from '@angular/common';
import { AgePipe } from 'src/app/common/pipes/age.pipe';

import { PaperPipe } from 'src/app/common/pipes/paper.pipe';
import { SessionPipe } from 'src/app/common/pipes/session.pipe';

import { PopupComponent } from 'src/app/views/workflow/popup/popup.component';
import { PopupQuestionComponent } from 'src/app/views/workflow/popup/popup-question.component';
import { NotificationComponent } from '../../common/utils/notification/notification.component';
import { DialogModule } from 'src/app/common/utils/dialog/dialog.module';
import { TablerhDirective } from '../../common/utils/tablerh.directive';
import { SortPipe } from '../../common/pipes/sort.pipe';
import { HideUnauthDirective } from '../../common/utils/auth/hide-unauth.directive';
import { DisableUnauthDirective } from '../../common/utils/auth/disable-unauth.directive';
import { ClickDisableUnauthDirective } from '../../common/utils/auth/click-disable-unauth.directive';
import { LazyLoadDirective } from '../../common/utils/lazy-load.directive';

@NgModule({
  declarations: [
    ReversePipe,
    SeshPipe,
    DaydiffPipe,
    FilterPipe,
    DynamicComponentDirective,
    VehicleDirective,
    PopupComponent,
    PopupQuestionComponent,
    NewDatePipe,
    AgePipe,
    PaperPipe,
    SessionPipe,
    NotificationComponent,
    TablerhDirective,
    SortPipe,
    HideUnauthDirective,
    DisableUnauthDirective,
    ClickDisableUnauthDirective,
    LazyLoadDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    ReversePipe,
    SeshPipe,
    DaydiffPipe,
    FilterPipe,
    DynamicComponentDirective,
    VehicleDirective,
    PopupComponent,
    PopupQuestionComponent,
    NewDatePipe,
    AgePipe,
    PaperPipe,
    SessionPipe,
    NotificationComponent,
    TablerhDirective,
    SortPipe,
    DisableUnauthDirective,
    HideUnauthDirective,
    ClickDisableUnauthDirective,
    LazyLoadDirective
  ],
  providers: [
    DatePipe
  ],
})
export class UtilsModule { }
