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

  // createInvoice(data): Observable<any> {
  //   return this.http.post<any>(this.url + 'orders/create_proforma.php', data);
  // }

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

  // sendForAmendment(info): Observable<any> {
  //   return this.http.post<any>(this.url + 'orders/amend_proforma.php', info);
  // }

  changeStatus(info): Observable<any> {
    return this.http.post<any>(this.url + 'orders/changeStatus.php', info);
  }

  // toBeChecked(info): Observable<any> {
  //   return this.http.post<any>(this.url + 'orders/toBeChecked.php', info);
  // }

  // toBeReady(info): Observable<any> {
  //   return this.http.post<any>(this.url + 'orders/toBeReady.php', info);
  // }

  startGP(info): Observable<any> {
    return this.http.post(this.url + 'orders/startGP.php', info);
  }

  saveGP(info): Observable<any> {
    return this.http.post(this.url + 'orders/saveGP.php', info);
  }

  markStatus(info): Observable<any> {
    return this.http.post(this.url + 'orders/sendReq.php', info);
  }

  markChecked(id): Observable<any> {
    return this.http.get(this.url + 'orders/markChecked.php?id=' + id);
  }

  markVerified(id): Observable<any> {
    return this.http.get(this.url + 'orders/markVerified.php?id=' + id);
  }

  // Pastel

  sendToPastel(info): Observable<any> {
    return this.http.post(this.url + 'orders/sendToPastel.php', info);
  }

  // Purchases

  getPurchases(): Observable<any> {
    return this.http.get(this.url + 'purchases/read_purchase.php');
  }
}