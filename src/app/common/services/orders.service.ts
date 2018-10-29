import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getInvoices(data): Observable<any> {
    return this.http.post(this.url + 'orders/read.php', {'status': data});
  }

  getInvoice(id) {
    return this.http.get(this.url + 'orders/read_one.php?id=' + id);
  }
}
