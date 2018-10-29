import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable, of } from 'rxjs';
import { debounceTime, delay, switchMap } from 'rxjs/operators';

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

  search(keywords): Observable<any> {
    return of(true).pipe(
      delay(500),
      switchMap(() => {
        return this.http.get(this.url + 'customers/search.php' + `?s=${keywords}`);
      })
    );
  }

  // Update

  // Delete

  deleteCustomer(info): Observable<any>  {
    return this.http.post(this.url + 'customers/delete.php', info);
  }
}

