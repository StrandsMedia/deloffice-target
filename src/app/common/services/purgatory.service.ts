import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurgatoryService {
  private _apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  public createPurchasing(info): Observable<any> {
    return this._http.post(this._apiUrl + 'purchases/init_purchase.php', info);
  }

  public getPurchasingData(status, type): Observable<any> {
    return this._http.get(this._apiUrl + 'purchases/read_purchase.php?type=' + type + '&status=' + status);
  }

  public getPurchasingProduct(id, type): Observable<any> {
    return this._http.get(this._apiUrl + 'purchases/read_purchase_prod.php?id=' + id + '&s=' + type);
  }

  public amendPurchase(info): Observable<any> {
    return this._http.post(this._apiUrl + 'purchases/handle_purchase.php', info);
  }

  // Tables

  public readTables(): Observable<any> {
    return this._http.get(this._apiUrl + 'tables/readTables.php');
  }

  public newSession(info): Observable<any> {
    return this._http.post(this._apiUrl + 'tables/newSession.php', info);
  }

  public closeSession(info): Observable<any> {
    return this._http.post(this._apiUrl + 'tables/closeSession.php', info);
  }
}
