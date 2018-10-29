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

  getPrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/read.php', info);
  }
}
