import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Generates a CSV file from a comma-separated array.
   * @param {Array} csv - Array formatted to create CSV file
   * @param {string} filename - Name of generated file
  */
  downloadCSV(csv: any, filename: string): void {
    let csvFile;
    let downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: 'text/csv'});

    // Download link
    downloadLink = document.createElement('a');

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none';

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  }

  /**
   * This function generates a comma-separated array of values formatted to be saved in CSV and then downloads it
   * @param filename - Name of file to be generated
   */
  tbltoCSV(filename: string) {
    const csv = [];
    const rows = document.querySelectorAll('table#cmtreport tr');

    for (let i = 0; i < rows.length; i++) {
      const row = [], cols = rows[i].querySelectorAll('td, th') as any;
      // tslint:disable-next-line:curly
      for (let j = 0; j < cols.length; j++) {
        const str = cols[j].innerText as string;
        row.push(str.replace(/,/g, '-'));
      }

      csv.push(row.join(','));
    }

    // Download CSV
    this.downloadCSV(csv.join('\n'), filename);
  }

  /**
   * This function fetches comments from the database depending on the parameters fed to it
   * @param {number} number - If sales comments or debtors comments
   * @param {number} user - Optional: Fetch comment by user
   * @param {number} cust - Optional: Fetch comment by customer id
   */
  getComments(number: number, user?: number, cust?: number): Observable<any> {
    let url = this.url + 'comments/read.php';
    switch (number) {
      case 1:
        url = url + '?s=1';
        break;
      case 2:
        url = url;
        break;
    }

    if (user) {
      if (user !== 0) {
        if (number === 1) {
          url = url + '&u=' + user;
        } else {
          url = url + '?u=' + user;
        }
      } else {
        url = url;
      }

    }
    if (cust) {
      if (number === 1) {
        url = url + '&c=' + cust;
      } else {
        if (user) {
          url = url + '&c=' + cust;
        } else {
          url = url + '?c=' + cust;
        }
      }
    }
    // Return a long polling observable that asks the PHP script to re-render the data every 10 seconds.
    return timer(0, 10000).pipe(
      switchMap((v) => {
        return this.http.get(url);
      })
    );
  }


  /**
   * Retrieves the comments for report
   * @param info - contains from and to date to get comments
   */
  getCmtReport(info): Observable<any> {
    let url = this.url + 'comments/report.php';
    url = url + '?u=' + info.user + '&d1=' + info.from + '&d2=' + info.to;
    return this.http.get(url);
  }

  /**
   * Inserts a comment into the database
   * @param info - Data to insert as comment in database
   */
  insertCmt(info): Observable<any> {
    return this.http.post(this.url + 'comments/insert.php', info);
  }
}
