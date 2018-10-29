import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable, of } from 'rxjs';
import { debounceTime, delay, map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  get currentUser(): Observable<User> {
    return of(JSON.parse(localStorage.getItem('currentUser'))).pipe(
      map((data) => {
        if (data) {
          return data;
        } else {
          return null;
        }
      })
    );
  }

  login(info) {
    return this.http.post(this.url + 'user/login.php', info).pipe(
      delay(1000),
      map((res: User) => {
        if (res.status === 'loggedin') {
          localStorage.setItem('currentUser', JSON.stringify(res));
          return res;
        } else {
          return res;
        }
      })
    );
  }

  logout() {
    return of(localStorage.removeItem('currentUser'));
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

  private updateToken(user) {
    //
  }

  public getUsers() {
    return this.http.get(this.url + 'user/read.php');
  }
}
