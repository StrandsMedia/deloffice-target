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

  constructor(private http: HttpClient) { }

  // Create

  addCustomer(info): Observable<any> {
    return this.http.post(this.url + 'customers/create.php', info);
  }

  // Read

  getCustomers(keyword?): Observable<any> {
    let url = this.url + 'customers/read.php';
    keyword ? url = url + '?s=' + keyword : url = url;
    return this.http.get(url);
  }

  getCustomer(id): Observable<any> {
    return this.http.get(this.url + 'customers/read_one.php' + `?id=${id}`);
  }

  getBalance(id): Observable<any> {
    return this.http.get(this.url + 'customers/pastel/balance.php' + `?id=${id}`);
  }

  getAllocs(id): Observable<any> {
    return this.http.get(this.url + 'customers/pastel/allocations.php' + `?id=${id}`);
  }

  getReverseAllocs(id): Observable<any> {
    return this.http.get(this.url + 'customers/pastel/reverse_allocations.php' + `?id=${id}`);
  }

  getStatement(id): Observable<any> {
    return this.http.get(this.url + 'customers/pastel/statement.php' + `?id=${id}`);
  }

  search(keywords): Observable<any> {
    return of(true).pipe(
      delay(500),
      switchMap(() => {
        return this.http.get(this.url + 'customers/search.php' + `?s=${keywords}`);
      })
    );
  }

  searchCust(keywords): Observable<any> {
    return this.http.get(this.url + 'customers/search_cust.php' + `?s=${keywords}`).pipe(
      map((res: any) => res.records)
    );
  }

  // Update

  updateDetails(info): Observable<any> {
    return this.http.post(this.url + 'customers/update_details.php', info);
  }

  // Delete

  deleteCustomer(info): Observable<any>  {
    return this.http.post(this.url + 'customers/delete.php', info);
  }
}

