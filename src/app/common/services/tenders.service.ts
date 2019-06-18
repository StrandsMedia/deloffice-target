import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TendersService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createTender(info): Observable<any> {
    return this.http.post(this.url + 'tender/create.php', info);
  }

  getTenders(info): Observable<any> {
    return this.http.post(this.url + 'tender/read.php', info);
  }

  updateTender(info): Observable<any> {
    return this.http.post(this.url + 'tender/update.php', info);
  }


}
