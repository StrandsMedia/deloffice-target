import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EditComponent } from '../../views/orders/edit/edit.component';
import { ConfirmService } from '../services/confirm.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class RedirectGuard implements CanDeactivate<EditComponent> {
  constructor(private _confirm: ConfirmService) { }

  canDeactivate(
    component: EditComponent,
    currentRoute: ActivatedRouteSnapshot, 
    currentState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (component.changed) {
      return this._confirm.confirm('Do you want to save before you exit?').pipe(tap(v => {if (v) component.savePDF()}))
    } else {
      return true;
    }
  }
}