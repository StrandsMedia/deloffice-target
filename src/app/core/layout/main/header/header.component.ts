import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../common/services/auth.service';
import { CustomerService } from '../../../../common/services/customer.service';
import { PlatformService } from '../../../../common/services/platform.service';

import { fromEvent, of, BehaviorSubject, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchResults: any[];

  public currentUser;

  private keyword: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private keywordObs: Observable<string> = this.keyword.asObservable();

  constructor(
    private auth: AuthService,
    private platform: PlatformService,
    private cust: CustomerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchField();
    this.currentUser = this.auth.currentUser;
  }

  searchField() {
    if (this.platform.platformCheck) {
      const searchField = <HTMLInputElement>document.querySelector('input[type="search"]');
      fromEvent(searchField, 'blur').subscribe(() => {
        searchField.placeholder = 'Search for customers...';
        if (searchField.value.trim().length > 0) {
          searchField.classList.add('unBlurred-value');
          of(true).pipe(delay(100)).subscribe(() => {
            this.searchResults = [];
          });
        } else {
          searchField.classList.remove('unBlurred-value');
        }
      });

      fromEvent(searchField, 'focus').subscribe(() => {
        searchField.placeholder = '';
      });
    }
  }

  searchAuto($event: any) {
    if ($event.target.value !== '') {
      const q = $event.target.value;
      this.keyword.next(q);

      this.keywordObs.pipe(
        switchMap((value) => {
          return this.cust.search(value);
        })
      ).subscribe((results) => {
        this.searchResults = results;
      });
    }
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

}
