import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap, tap, map, filter } from 'rxjs/operators';
import { MaterialService } from './material.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private mdc: MaterialService
  ) { }

  uploadFile(info) {
    return this.http.post(this._url + 'utils/upload_file.php', info, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.mdc.materialSnackBar({ message: `Upload Progress: ${Math.round(event.loaded / event.total * 100)}%` });
        }
      })
    );
  }

  insertProd(info): Observable<any> {
    return this.http.post(this._url + 'products/insertProd.php', info);
  }

  getCategories(): Observable<any> {
    return this.http.get(this._url + 'products/readCategories.php');
  }

  getCategoriesIrr(): Observable<any> {
    return this.http.get(this._url + 'products/readCategory.php');
  }

  getProdByCat(id?: number, cat?: number, mode?: number): Observable<any> {
    let url = this._url + 'products/getProdByCat.php';

    if (id) {
      url = url + '?id=' + id;
    }

    if (cat) {
      url = url + '&c=' + cat;
    }

    if (mode) {
      url = url + '&m=' + mode;
    }

    return this.http.get(url);
  }

  getProdById(id): Observable<any> {
    return this.http.get(this._url + 'products/getProdById.php?id=' + id);
  }

  getFullProdById(id): Observable<any> {
    return this.http.get(this._url + 'products/getFullProdById.php?id=' + id);
  }

  getProdByName(info): Observable<any> {
    return this.http.post(this._url + 'products/getProdByName.php', info);
  }

  search(keywords): Observable<any> {
    return this.http.get(this._url + 'products/search.php?s=' + keywords);
  }

  searchAdv(info): Observable<any> {
    return this.http.post(this._url + 'products/search_adv.php', info);
  }

  searchOneAdv(info): Observable<any> {
    return this.http.post(this._url + 'products/search_one.php', info);
  }

  updateProd(info): Observable<any> {
    return this.http.post(this._url + 'products/updateProd.php', info);
  }

  duplicateCheck(id): Observable<any> {
    return this.http.get(this._url + 'products/duplicateCheck.php?id=' + id);
  }
}
