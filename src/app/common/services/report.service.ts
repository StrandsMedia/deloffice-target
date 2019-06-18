import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap, tap, map, filter } from 'rxjs/operators';
import { MaterialService } from './material.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private mdc: MaterialService
  ) { }

  getSalesMonth(id) {
    return this.http.get(this.url + 'reports/qtyReport.php?p=' + id);
  }
}
