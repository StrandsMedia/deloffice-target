import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

interface Printer {
  printerId: number;
  printerName: string;
  active: number;
  createdAt: string;
  updatedAt: string;
}

interface InkReport {
  reportId: number;
  printerId: number;
  printerName?: string;
  inkChangedType: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createPrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/create.php', info);
  }

  getPrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/read.php', info);
  }

  updatePrinting(info): Observable<any> {
    return this.http.post(this.url + 'printing/update.php', info);
  }

  // Printers

  createPrinter(info: Printer): Observable<any> {
    return this.http.post<Printer>(this.url + 'printing/printers/create.php', info);
  }

  getPrinters(): Observable<{ records: Printer[]}> {
    return this.http.get<any>(this.url + 'printing/printers/read.php');
  }

  // Ink Report

  createEntries(info: InkReport): Observable<any> {
    return this.http.post<InkReport>(this.url + 'printing/ink_report/create.php', info);
  }
  
  getEntries(): Observable<{ records: InkReport[]}> {
    return this.http.get<any>(this.url + 'printing/ink_report/read.php');
  }
}