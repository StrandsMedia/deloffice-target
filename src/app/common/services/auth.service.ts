import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { AuthorizationService } from '../utils/auth/authorization.service';
import { LocalStorage } from '../classes/localstorage';

import { environment } from '../../../environments/environment';

import { Observable, of, timer, from } from 'rxjs';
import { debounceTime, delay, map, switchMap, filter, tap } from 'rxjs/operators';

interface User {
  status: string;
  user_id: string;
  username: string;
  usertype: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiUrl;
  private _localStorage = new LocalStorage<User>('currentUser');

  constructor(
    private _auth: AuthorizationService,
    private _http: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  /**
   * Function retrieves the current logged in user, stored in localStorage.
   * Current user is retrieved as an observable.
   * Is somewhat useless to use an observable. Should have been a promise based getter.
   */
  get currentUser(): Observable<User> {
    return this._localStorage.select('currentUser').pipe(
      map((data) => {
        if (data) {
          return data;
        } else {
          return null;
        }
      })
    );
  }

  /** Function sends a request to the database for the credentials input and returns a status.
   * The status will determine if login was successful or not.
   * @param info
   * Should contain username and password as valid information for successful login.
   * On success, the current user data is stored inside the localStorage item.
   */
  login(info): Observable<User> {
    return this._http.post<User>(this.url + 'user/login.php', info).pipe(
      delay(1000),
      map((res: User) => {
        if (res.status === 'loggedin') {
          this._localStorage.set('currentUser', res);
          return res;
        } else {
          return res;
        }
      })
    );
  }

  tempLogin(info): Observable<User> {
    return this._http.post<User>(this.url + 'user/login.php', info).pipe(
      delay(1000),
      map((res: User) => {
        return res;
      })
    )
  }

  logout(): Observable<void> {
    return of(this._localStorage.remove('currentUser'));
  }

  canRead(user: User): boolean {
    const allowed = ['Admin', 'Marketing', 'Sales', 'Delivery', 'Accounting', 'Printing'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['Admin', 'Marketing', 'Sales', 'Delivery', 'Accounting', 'Printing'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['Admin', 'Accounting'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    // tslint:disable-next-line:curly
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.usertype === role) {
        return true;
      }
    }
    return false;
  }

  public getPermissions(): Observable<any> {
    return this._http.get(this.url + 'permission/read.php');
  }

  public changePermission(info): Observable<any> {
    return this._http.post(this.url + 'permission/change.php', info);
  }

  public loadPermissions(): Observable<any> {
    return this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(data => this._route.snapshot),
      map(snapshot => {
        if (snapshot) {
          let data = ({...snapshot.data, ...snapshot.firstChild.data, ...snapshot.firstChild.firstChild.data});
          if (snapshot.firstChild.firstChild.firstChild) {
            data = ({...snapshot.data, ...snapshot.firstChild.data, ...snapshot.firstChild.firstChild.data, ...snapshot.firstChild.firstChild.firstChild.data});
          }
          return data;
        } else {
          return {};
        }
      }),
      switchMap(data => {
        if (data && data.id) {
          return this.getPermissionByModule(data.id);
        } else {
          return of({});
        }
      })
    );
  }

  private getPermissionByModule(id): Observable<any> {
    return this._http.get(this.url + 'permission/read_module.php?id=' + id);
  }

  public createUser(info): Observable<any> {
    return this._http.post(this.url + 'user/create.php', info);
  }

  public getUsers(): Observable<any> {
    return this._http.get(this.url + 'user/read.php');
  }

  public updateUser(info): Observable<any> {
    return this._http.post(this.url + 'user/update.php', info);
  }

  public getPastelSessions(): Observable<any> {
    return timer(0, 10000).pipe(
      switchMap((v) => {
        return this._http.get(this.url + 'user/pastel/read.php');
      }),
      map((data) => {
        data['updatedAt'] = new Date();
        return data;
      })
    );
  }

  public killSession(id): Observable<any> {
    return this._http.get(this.url + 'user/pastel/kill.php?id=' + id);
  }

  //Company
  createCompany(info) {
    return this._http.post(this.url + 'company/create.php', info);
  }

  getCompany(): Observable<any>{
    return this._http.get(this.url + 'company/read.php').pipe(
      map((company: any) => company.records)
    ); 
  }
}
