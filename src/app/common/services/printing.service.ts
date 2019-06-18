import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createPrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/create.php', info);
  }

  getPrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/read.php', info);
  }

  updatePrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/update.php', info);
  }
}
