import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { TitleService } from './common/services/title.service';
import { NotificationService } from './common/services/notification.service';

import { AuthService } from './common/services/auth.service';

import { Observable, from } from 'rxjs';
import { map, switchMap, filter, tap } from 'rxjs/operators';
import { AuthorizationService } from './common/utils/auth/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Target';

  constructor(
    private _auth: AuthService,
    private _authorize: AuthorizationService,
    private _title: TitleService,
    private _notif: NotificationService,
    private _router: Router
  ) {

  }

  ngOnInit() {
    this._auth.loadPermissions()
    .pipe(
      tap((data) => {
        localStorage.setItem('currentUserPermission', JSON.stringify(data));
      }),
      switchMap(data => {
        return from(this._authorize.initPermissions());
      }),
      tap((data) => {
        // console.log(data);
      })
    )
    .subscribe();

    this._notif.checkInstance();
    this._title.fetchTitle().subscribe();
  }
}
