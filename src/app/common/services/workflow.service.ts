import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getWorkflow(number): Observable<any> {
    let data;

    // Check if asking for data for sales or delivery
    switch (number) {
      case 1:
        data = {
          range1: '1',
          range2: '5'
        };
        break;
      case 2:
        data = {
          range1: '6',
          range2: '9'
        };
        break;
    }

    // Return a long polling observable that asks the PHP script to re-render the data every 10 seconds.
    return timer(0, 10000).pipe(
      switchMap((v) => {
        return this.http.post(this.url + 'workflow/read.php', data);
      })
    );
  }

  getGoodsReady(): Observable<any> {
    // Return a long polling observable that asks the PHP script to re-render the data every 10 seconds.
    return timer(0, 10000).pipe(
      switchMap((v) => {
        return this.http.get(this.url + 'workflow/goodsReady.php');
      })
    );
  }

  sessionRead(number, date?): Observable<any> {
    let data;

    // Check if asking for data for sales or delivery
    switch (number) {
      case 0:
        data = {
          range1: '0',
          range2: '0'
        };
        break;
      case 1:
        data = {
          range1: '0',
          range2: '2'
        };
        break;
      case 2:
        data = {
          range1: '1',
          range2: '2'
        };
        break;
    }

    let url = this.url + 'workflow/readSession.php?';
    url = url + 'r1=' + data.range1 + '&r2=' + data.range2;

    if (number === 2) {
      url = url + '&r3=1';
    } else if (number === 1) {
      url = url + '&r3=0';
    } else {
      url = this.url + 'workflow/archiveSession.php?dt=' + date;
    }

    // Return a long polling observable that asks the PHP script to re-render the data every 10 seconds.
    return timer(0, 10000).pipe(
      switchMap((v) => {
        return this.http.get(url);
      })
    );
  }

  readSession(info): Observable<any> {
    return this.http.post(this.url + 'workflow/deliveryArchive.php', info);
  }

  readByCust(id: number): Observable<any> {
    return this.http.get(this.url + 'workflow/readByCust.php?s=' + id);
  }

  readByStatus(status: number): Observable<any>  {
    return this.http.get(this.url + 'workflow/readByStatus.php?s=' + status);
  }

  readUserData(info): Observable<any>  {
    return this.http.post(this.url + 'user/user_data.php', info);
  }
}
