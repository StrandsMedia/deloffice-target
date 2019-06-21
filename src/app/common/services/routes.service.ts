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

  getRoute(): Observable<any>{
    return this._http.get(this.url + 'routes/read.php').pipe(
      map((route: any) => route.records)
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
}
