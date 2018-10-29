import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CdkTableModule } from '@angular/cdk/table';
import { DragulaModule } from 'ng2-dragula';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './core/layout/main/main.component';
import { HeaderComponent } from './core/layout/main/header/header.component';
import { FooterComponent } from './core/layout/main/footer/footer.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CustomersComponent } from './views/customers/customers.component';
import { BtnModule } from './common/utils/btn/btn.module';
import { SalesComponent } from './views/workflow/sales/sales.component';
import { DeliveryComponent } from './views/workflow/delivery/delivery.component';
import { DaydiffPipe } from './common/pipes/daydiff.pipe';
import { FilterPipe } from './common/pipes/filter.pipe';
import { CustomerComponent } from './views/customers/customer/customer.component';
import { SessionsComponent } from './views/workflow/sessions/sessions.component';
import { DynamicComponentDirective } from './common/utils/dynamic.component.directive';
import { PushComponent } from './views/workflow/sessions/push/push.component';
import { TempComponent } from './views/workflow/sessions/temp/temp.component';
import { InprogressComponent } from './views/workflow/sessions/inprogress/inprogress.component';
import { ArchivedComponent } from './views/workflow/sessions/archived/archived.component';
import { CommentsComponent } from './views/comments/comments.component';
import { PrintingComponent } from './views/printing/printing.component';
import { ProductsComponent } from './views/products/products.component';
import { TendersComponent } from './views/tenders/tenders.component';
import { ArchiveComponent } from './views/workflow/archive/archive.component';
import { PurchaseComponent } from './views/workflow/purchase/purchase.component';
import { CreditComponent } from './views/workflow/credit/credit.component';
import { CancelComponent } from './views/workflow/cancel/cancel.component';
import { UserComponent } from './views/workflow/user/user.component';
import { DialogModule } from './common/utils/dialog/dialog.module';
import { SnackbarModule } from './common/utils/snackbar/snackbar.module';
import { VehicleDirective } from './common/utils/vehicle.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CustomersComponent,
    SalesComponent,
    DeliveryComponent,
    DaydiffPipe,
    FilterPipe,
    CustomerComponent,
    SessionsComponent,
    DynamicComponentDirective,
    PushComponent,
    TempComponent,
    InprogressComponent,
    ArchivedComponent,
    CommentsComponent,
    PrintingComponent,
    ProductsComponent,
    TendersComponent,
    ArchiveComponent,
    PurchaseComponent,
    CreditComponent,
    CancelComponent,
    UserComponent,
    VehicleDirective,
  ],
  entryComponents: [
    PushComponent,
    TempComponent,
    InprogressComponent,
    ArchivedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CdkTableModule,
    BtnModule,
    DragulaModule.forRoot(),
    DialogModule,
    SnackbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
