import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface ReportData {
  sector: number;
  subsector?: number;
  category?: number;
  subcategory?: number;
}

@Injectable({
  providedIn: 'root'
})


export class MarketingService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  generateMktReport(data: ReportData): Observable<any> {
    let dataURL = this.url + 'customers/pastel/mkt_report.php';
    if (data.sector) {
      dataURL = dataURL + '?s=' + data.sector;
    }
    if (data.subsector) {
      dataURL = dataURL + '&ss=' + data.subsector;
    }
    if (data.category) {
      dataURL = dataURL + '&c=' + data.category;
    }
    if (data.subcategory) {
      dataURL = dataURL + '&sc=' + data.subcategory;
    }
    return this.http.get(dataURL);
  }
}
