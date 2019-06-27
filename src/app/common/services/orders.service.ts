import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createInvoice(data): Observable<any> {
    return this.http.post<any>(this.url + 'orders/create_proforma.php', data);
  }

  getInvoices(data): Observable<any> {
    return this.http.post(this.url + 'orders/read.php', {'status': data});
  }

  getInvoice(id) {
    return this.http.get(this.url + 'orders/read_one.php?id=' + id);
  }

  updateInvoice(data): Observable<any> {
    return this.http.post<any>(this.url + 'orders/update_proforma.php', data);
  }

  processInvoice(data): Observable<any> {
    return this.http.post<any>(this.url + 'orders/process_proforma.php', data);
  }

  // Goods Preparation

  sendReqTransfer(info): Observable<any> {
    return this.http.post<any>(this.url + 'purgatory/create.php', info);
  }

  getPurgatory() {
    
  }

  markChecked(id): Observable<any> {
    return this.http.get(this.url + 'orders/markChecked.php?id=' + id);
  }

  markVerified(id): Observable<any> {
    return this.http.get(this.url + 'orders/markVerified.php?id=' + id);
  }
}