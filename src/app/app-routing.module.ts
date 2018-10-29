import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './core/layout/main/main.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CustomersComponent } from './views/customers/customers.component';
import { SalesComponent } from './views/workflow/sales/sales.component';
import { DeliveryComponent } from './views/workflow/delivery/delivery.component';
import { CustomerComponent } from './views/customers/customer/customer.component';
import { SessionsComponent } from './views/workflow/sessions/sessions.component';
import { AuthGuard } from './common/guards/auth.guard';
import { CommentsComponent } from './views/comments/comments.component';
import { ArchiveComponent } from './views/workflow/archive/archive.component';
import { CreditComponent } from './views/workflow/credit/credit.component';
import { CancelComponent } from './views/workflow/cancel/cancel.component';
import { UserComponent } from './views/workflow/user/user.component';
import { PurchaseComponent } from './views/workflow/purchase/purchase.component';
import { PrintingComponent } from './views/printing/printing.component';
import { ProductsComponent } from './views/products/products.component';
import { TendersComponent } from './views/tenders/tenders.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './core/modules/login/login.module#LoginModule',
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'customers',
        children: [
          { path: '', component: CustomersComponent, pathMatch: 'full' },
          { path: ':id', component: CustomerComponent }
        ]
      },
      {
        path: 'order-entry',
        loadChildren: './core/modules/order/order.module#OrderModule',
      },
      {
        path: 'workflow',
        children: [
          {
            path: 'sales',
            component: SalesComponent
          },
          {
            path: 'delivery',
            component: DeliveryComponent
          },
          {
            path: 'sessions',
            component: SessionsComponent
          },
          {
            path: 'delivery-archive',
            component: ArchiveComponent
          },
          {
            path: 'purchase-report',
            component: PurchaseComponent
          },
          {
            path: 'credit-note-report',
            component: CreditComponent
          },
          {
            path: 'cancel-report',
            component: CancelComponent
          },
          {
            path: 'user-report',
            component: UserComponent
          },
        ]
      },
      {
        path: 'comments',
        component: CommentsComponent
      },
      {
        path: 'printing',
        component: PrintingComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'tenders',
        component: TendersComponent
      },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '*',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
