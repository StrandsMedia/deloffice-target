import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  downloadCSV(csv, filename) {
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

  tbltoCSV(filename) {
    const csv = [];
    const rows = document.querySelectorAll('table tr');

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

  getComments(number, user?, cust?) {
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
}
