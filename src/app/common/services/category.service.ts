import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCategory(): Observable<any> {
    return this.http.get(this.url + 'category/read.php').pipe(
      map((category: any) => category.category)
    );
  }

  getSector(): Observable<any> {
    return this.http.get(this.url + 'category/read.php').pipe(
      map((category: any) => category.sector)
    );
  }

  getSubsector(): Observable<any> {
    return this.http.get(this.url + 'category/read.php').pipe(
      map((category: any) => category.subsector)
    );
  }
}
