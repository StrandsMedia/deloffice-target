import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivateChild {

  constructor(public _router: Router, private _auth: AuthService) {}

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole: string[] = route.data.expectedRole;

    return this._auth.currentUser.pipe(
      take(1),
      map(user => {
        if (user) {
          if (expectedRole) {
            return expectedRole.includes(user.usertype) || user.usertype === 'Admin';
          }
          return !!user;
        }
      }),
      tap(v => {
        if (!v) {
          alert('You do not have the required permissions to access this page.');
          this._router.navigate(['/']);
        }
      })
    );
  }
}
