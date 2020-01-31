import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private url = environment.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  //Route
  createRoute(info) {
    return this._http.post(this.url + 'routes/create.php', info);
  }

  getRoute(id?): Observable<any>{
    let url = '';

    if (id) {
      url = this.url + 'routes/read_one.php?id=' + id;
    } else {
      url = this.url + 'routes/read.php';
    }
    return this._http.get(url).pipe(
      map((route: any) => {
        if (id) {
          return route;
        } else {
          return route.records;
        }
      })
    ); 
  }

  //Location
  createLocation(info) {
    return this._http.post(this.url + 'locations/create.php', info);
  }

  getLocation(): Observable<any>{
    return this._http.get(this.url + 'locations/read.php').pipe(
      map((location: any) => location.records)
    ); 
  }

  addLocation(info) {
    return this._http.post(this.url + 'locations/create_routeloc.php', info);
  }

  switchPlace(info) {
    return this._http.post(this.url + 'locations/switch_rank.php', info);
  }
}
