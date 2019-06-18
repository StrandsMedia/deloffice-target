import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pastel',
  templateUrl: './pastel.component.html',
  styleUrls: ['./pastel.component.scss']
})
export class PastelComponent implements OnInit {
  dataSource$: Observable<any>;
  public user: any;

  columns = [
    'id',
    'database',
    'user',
    'agent',
    'connected',
    'refresh',
    'kill'
  ];

  constructor(
    private auth: AuthService
  ) {
    this.auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.dataSource$ = this.auth.getPastelSessions().pipe(
      map((data) => {
        if (data.records) {
          const arr = this.classify(data.records);
          ((arr) as Array<{}>).sort((a, b) => {
            // tslint:disable-next-line:curly
            if (a['status'] < b['status']) return -1;
            // tslint:disable-next-line:curly
            if (a['status'] > b['status']) return 1;
            return 0;
          });
          data.records = arr;
        }
        return data;
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  parseName(name: string): string {
    if (name) {
      let parsed = name.toLowerCase();
      parsed = parsed;

      return parsed;
    }
    return null;
  }

  parseUserName(name: string): string {
    if (name) {
      name = name.toLowerCase();
      if (name.includes('.')) {
        const parsed = name.split('.');
        return `${parsed[0]}. ${parsed[1]}`;
      }
      return name;
    }
    return null;
  }

  classify(arr: Array<any>): Array<any> {
    /*
      status description
      1 is Sales DelOffice
      2 is Accounts DelOffice
      3 is Sales RollnSheet
    */
    arr.forEach(el => {
      if (el.DatabaseName === 'DELLOFFICE') {
        if (((el.AgentName).toLowerCase()) === 'accounts') {
          el.status = 2;
        } else {
          el.status = 1;
        }
      } else if (el.DatabaseName === 'ROLLNSHEETLTD') {
        if (((el.AgentName).toLowerCase()) === 'accounts') {
          el.status = 2;
        } else {
          el.status = 3;
        }
      } else {
        if (((el.AgentName).toLowerCase()) === 'accounts') {
          el.status = 2;
        } else {
          el.status = 3;
        }
      }
    });

    return arr;
  }

  killSession(id) {
    this.auth.killSession(id).subscribe(
      data => console.log(data),
      err => console.log(err),
      () => ''
    );
  }

}
