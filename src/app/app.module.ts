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

import { CustomerComponent } from './views/customers/customer/customer.component';

import { CommentsComponent } from './views/comments/comments.component';
import { PrintingComponent } from './views/printing/printing.component';
import { ProductsComponent } from './views/products/products.component';
import { TendersComponent } from './views/tenders/tenders.component';

import { DialogModule } from './common/utils/dialog/dialog.module';
import { SnackbarModule } from './common/utils/snackbar/snackbar.module';

import { NewsComponent } from './views/customers/customer/news/news.component';
import { PricingComponent } from './views/customers/customer/pricing/pricing.component';
import { DetailsComponent } from './views/customers/customer/details/details.component';
import { CommsComponent } from './views/customers/customer/comments/comments.component';

import { UtilsModule } from './core/modules/utils.module';
import { PastelComponent } from './views/user/pastel/pastel.component';

import { UsersComponent } from './views/user/users/users.component';
import { StepComponent } from './views/user/step/step.component';
import { SectorComponent } from './views/sector/sector.component';
import { UserPermissionsComponent } from './views/user/user-permissions/user-permissions.component';
import { CompaniesComponent } from './views/companies/companies.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    CustomersComponent,
    CustomerComponent,
    CommentsComponent,
    PrintingComponent,
    TendersComponent,
    NewsComponent,
    PricingComponent,
    DetailsComponent,
    CommsComponent,
    PastelComponent,
    UsersComponent,
    StepComponent,
    SectorComponent,
    UserPermissionsComponent,
    CompaniesComponent
  ],
  entryComponents: [
    NewsComponent,
    PricingComponent,
    DetailsComponent,
    CommsComponent
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
    SnackbarModule,
    UtilsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
