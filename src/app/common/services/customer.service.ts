import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable, of } from 'rxjs';
import { debounceTime, delay, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = environment.apiUrl;
  private fbURL = environment.remoteURL;

  constructor(private http: HttpClient) { }

  // Create

  addCustomer(info): Observable<any> {
    return this.http.post(this.url + 'customers/create.php', info);
  }

  insertTarget(info): Observable<any> {
    return this.http.post(this.url + 'products/insertTarget.php', info);
  }

  // Read

  getCustomers(keyword?, data?): Observable<any> {
    let url = this.url + 'customers/read.php';
    if (keyword) {
      url = url + '?s=' + keyword

      if (data) {
        url = url + '&d=' + data
      }
    }

    if (data) {
      url = url + '?d=' + data
    }
    
    return this.http.get(url);
  }

  getCustomer(id, data?): Observable<any> {
    return this.http.get(this.url + 'customers/read_one.php' + `?id=${id}&d=${data}`);
  }

  getStatus(id): Observable<any> {
    return this.http.get(this.url + 'products/fetchStatus.php?id=' + id);
  }

  getTarget(id): Observable<any> {
    return this.http.get(this.url + 'products/fetchTarget.php?id=' + id);
  }

  getEmailInfo(id, data?): Observable<any> {
    let url = this.url + `customers/pastel/fetchEmail.php?id=${id}`;

    if (data) {
      url = url + `&d=${data}`;
    }

    return this.http.get(url);
  }

  getBalance(id, data?): Observable<any> {
    let url = this.url + `customers/pastel/balance.php?id=${id}`;

    if (data) {
      url = url + `&d=${data}`;
    }

    return this.http.get(url);
  }

  getAllocs(id, data?): Observable<any> {
    let url = this.url + `customers/pastel/allocations.php?id=${id}`;

    if (data) {
      url = url + `&d=${data}`;
    }

    return this.http.get(url);
  }

  getReverseAllocs(id): Observable<any> {
    return this.http.get(this.url + 'customers/pastel/reverse_allocations.php' + `?id=${id}`);
  }

  getStatement(id, data?): Observable<any> {
    let url = this.url + `customers/pastel/statement.php?id=${id}`;

    if (data) {
      url = url + `&d=${data}`;
    }

    return this.http.get(url);
  }

  getBalanceTotal(id, data?): Observable<any> {
    let url = this.url + `customers/pastel/balance_total.php?id=${id}`;

    if (data) {
      url = url + `&d=${data}`;
    }

    return this.http.get(url);
  }

  search(keywords): Observable<any> {
    return of(true).pipe(
      delay(500),
      switchMap(() => {
        return this.http.get(this.url + 'customers/search.php' + `?s=${keywords}`);
      })
    );
  }

  searchCust(keywords, data?): Observable<any> {
    let url = this.url + 'customers/search_cust.php' + `?s=${keywords}`;
    if (data) {
      url = url + '&d=' + data;
    }
    return this.http.get(url).pipe(
      debounceTime(1000),
      map((res: any) => res.records)
    );
  }

  // Update

  updateProfile(info): Observable<any> {
    return this.http.post(this.url + 'customers/update_profile.php', info);
  }

  updateDetails(info): Observable<any> {
    return this.http.post(this.url + 'customers/update_details.php', info);
  }

  updateStatus(info): Observable<any> {
    return this.http.post(this.url + 'products/updateStatus.php', info);
  }

  updateTerm(info): Observable<any> {
    return this.http.post(this.url + 'customers/pastel/update_term.php', info);
  }

  // Delete

  deleteCustomer(info): Observable<any>  {
    return this.http.post(this.url + 'customers/delete.php', info);
  }

  // Send Mail

  sendStatement(info): Observable<any> {
    return this.http.post(`${this.fbURL}sendStatement`, info);
  }
}

