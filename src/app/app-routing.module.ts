import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './core/layout/main/main.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CustomersComponent } from './views/customers/customers.component';

import { CustomerComponent } from './views/customers/customer/customer.component';

import { AuthGuard } from './common/guards/auth.guard';
import { CommentsComponent } from './views/comments/comments.component';

import { PrintingComponent } from './views/printing/printing.component';
import { TendersComponent } from './views/tenders/tenders.component';
import { CompaniesComponent } from './views/companies/companies.component';

import { PastelComponent } from './views/user/pastel/pastel.component';
import { UsersComponent } from './views/user/users/users.component';
import { StepComponent } from './views/user/step/step.component';
import { RoleGuard } from './common/guards/role.guard';
import { SectorComponent } from './views/sector/sector.component';
import { UserPermissionsComponent } from './views/user/user-permissions/user-permissions.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./core/modules/login/login.module').then(m => m.LoginModule),
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          id: 1
        }
      },
      {
        path: 'customers',
        children: [
          { path: '', component: CustomersComponent, pathMatch: 'full', data: { title: 'Customers', id: 2 } },
          { path: ':id', component: CustomerComponent, data: { id: 2 } }
        ]
      },
      {
        path: 'order-entry',
        loadChildren: () => import('./core/modules/order/order.module').then(m => m.OrderModule),
        canActivateChild: [RoleGuard]
      },
      {
        path: 'workflow',
        loadChildren: () => import('./core/modules/workflow/workflow.module').then(m => m.WorkflowModule),
      },
      {
        path: 'comments',
        component: CommentsComponent,
        data: {
          title: 'Comments',
          id: 5
        }
      },
      {
        path: 'printing',
        component: PrintingComponent,
        data: {
          title: 'Printing',
          id: 6
        }
      },
      {
        path: 'products',
        loadChildren: () => import('./core/modules/product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'tenders',
        component: TendersComponent,
        data: {
          title: 'Tender',
          id: 8
        }
      },
      {
        path: 'debtors',
        loadChildren: () => import('./core/modules/debtors/debtors.module').then(m => m.DebtorsModule),
        canActivateChild: [RoleGuard]
      },
      {
        path: 'sector',
        component: SectorComponent,
        data: {
          title: 'Sector',
          id: 9
        }
      },
      {
        path: 'users',
        children: [
          {
            path: 'pastel',
            component: PastelComponent,
            data: {
              title: 'Current Pastel Users',
              id: 10
            }
          },
          {
            path: 'userlist',
            component: UsersComponent,
            data: {
              title: 'Manage Users',
              expectedRole: ['Admin'],
              id: 11
            }
          },
          {
            path: 'step',
            component: StepComponent,
            data: {
              title: 'Cheat Steps',
              expectedRole: ['Admin'],
              id: 12
            },
          },
          {
            path: 'permissions',
            component: UserPermissionsComponent,
            data: {
              title: 'User Permissions',
              expectedRole: ['Admin'],
              id: 15
            },
          },
        ],
        canActivateChild: [RoleGuard]
      },
      {
        path: 'companies',
        component: CompaniesComponent,
        data: {
          title: 'Manage Companies',
          expectedRole: ['Admin'],
          id: 15
        }
      }
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
