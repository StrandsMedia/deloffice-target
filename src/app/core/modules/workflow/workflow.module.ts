import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { DialogModule } from '../../../common/utils/dialog/dialog.module';
import { UtilsModule } from '../utils.module';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { SalesComponent } from '../../../views/workflow/sales/sales.component';
import { DeliveryComponent } from '../../../views/workflow/delivery/delivery.component';
import { SessionsComponent } from '../../../views/workflow/sessions/sessions.component';
import { ArchiveComponent } from '../../../views/workflow/archive/archive.component';
import { PurchaseComponent } from '../../../views/workflow/purchase/purchase.component';
import { CreditComponent } from '../../../views/workflow/credit/credit.component';
import { CancelComponent } from '../../../views/workflow/cancel/cancel.component';
import { UserComponent } from '../../../views/workflow/user/user.component';
import { EventComponent } from '../../../views/workflow/event/event.component';
import { JobComponent } from '../../../views/workflow/job/job.component';
import { PushComponent } from '../../../views/workflow/sessions/push/push.component';
import { TempComponent } from '../../../views/workflow/sessions/temp/temp.component';
import { InprogressComponent } from '../../../views/workflow/sessions/inprogress/inprogress.component';
import { ArchivedComponent } from '../../../views/workflow/sessions/archived/archived.component';
import { CompletionComponent } from '../../../views/workflow/completion/completion.component';
import { ProformaComponent } from '../../../views/workflow/proforma/proforma.component';
import { GoodsPrepComponent } from '../../../views/workflow/goods-prep/goods-prep.component';
import { InvoicingComponent } from '../../../views/workflow/invoicing/invoicing.component';
import { RoutesComponent } from '../../../views/routes/routes.component';
import { LocationsComponent } from '../../../views/locations/locations.component';
import { TrackerComponent } from '../../../views/tracker/tracker.component';
import { DeliveryScheduleComponent } from '../../../views/workflow/delivery-schedule/delivery-schedule.component';
import { RouteComponent } from '../../../views/routes/route/route.component';
import { environment } from 'src/environments/environment';

const wfRoutes: Routes = [
  {
    path: 'routes',
    children: [
      {
        path: '',
        component: RoutesComponent,
        data: {
          title: 'Routes'
        }
      },
      {
        path: ':id',
        component: RouteComponent,
        data: {
          title: 'Route Data'
        }
      }
    ]
  },
  {
    path: 'locations',
    component: LocationsComponent,
    data: {
      title: 'Locations'
    }
  },
  {
    path: 'tracker',
    component: TrackerComponent,
    data: {
      title: 'Tracker'
    }
  },
  {
    path: 'marketing',
    component: SalesComponent,
    data: {
      title: 'Marketing Workflow',
      id: 4
    }
  },
  {
    path: 'proforma',
    component: ProformaComponent,
    data: {
      title: 'Proforma Workflow',
      id: 4
    }
  },
  {
    path: 'goods-preparation',
    component: GoodsPrepComponent,
    data: {
      title: 'Goods Prep. Workflow',
      id: 4
    }
  },
  {
    path: 'invoicing',
    component: InvoicingComponent,
    data: {
      title: 'Invoicing Workflow',
      id: 4
    }
  },
  {
    path: 'delivery',
    component: DeliveryComponent,
    data: {
      title: 'Delivery Workflow',
      id: 4
    }
  },
  {
    path: 'delivery-schedule',
    component: DeliveryScheduleComponent,
    data: {
      title: 'Delivery Schedule Workflow',
      id: 4
    }
  },
  {
    path: 'completion',
    component: CompletionComponent,
    data: {
      title: 'Completion Report',
      id: 4
    }
  },
  {
    path: 'sessions',
    component: SessionsComponent,
    data: {
      title: 'Delivery Sessions',
      id: 4
    }
  },
  {
    path: 'delivery-archive',
    component: ArchiveComponent,
    data: {
      title: 'Delivery Archive',
      id: 4
    }
  },
  {
    path: 'purchase-report',
    component: PurchaseComponent,
    data: {
      title: 'Purchase Report',
      id: 4
    }
  },
  {
    path: 'credit-note-report',
    component: CreditComponent,
    data: {
      title: 'Credit Note Report',
      id: 4
    }
  },
  {
    path: 'cancel-report',
    component: CancelComponent,
    data: {
      title: 'Cancel Report',
      id: 4
    }
  },
  {
    path: 'user-report',
    component: UserComponent,
    data: {
      title: 'User Report',
      id: 4
    }
  },
  {
    path: 'event/:id',
    component: EventComponent,
    data: {
      title: 'Workflow Event',
      id: 4
    }
  },
  {
    path: 'job/:id',
    component: JobComponent,
    data: {
      title: 'Workflow Job',
      id: 4
    }
  }
];

@NgModule({
  declarations: [
    SalesComponent,
    DeliveryComponent,
    EventComponent,
    JobComponent,
    UserComponent,
    CancelComponent,
    CreditComponent,
    PurchaseComponent,
    ArchiveComponent,
    SessionsComponent,
    PushComponent,
    TempComponent,
    InprogressComponent,
    ArchivedComponent,
    CompletionComponent,
    ProformaComponent,
    GoodsPrepComponent,
    InvoicingComponent,
    RoutesComponent,
    LocationsComponent,
    TrackerComponent,
    DeliveryScheduleComponent,
    RouteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(wfRoutes),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CdkTableModule,
    DragDropModule,
    UtilsModule,
    PdfJsViewerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  entryComponents: [
    PushComponent,
    TempComponent,
    InprogressComponent,
    ArchivedComponent,
  ],
})
export class WorkflowModule { }
