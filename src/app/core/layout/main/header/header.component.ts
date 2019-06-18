import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../common/services/auth.service';
import { CustomerService } from '../../../../common/services/customer.service';
import { PlatformService } from '../../../../common/services/platform.service';

import { fromEvent, of, BehaviorSubject, Observable } from 'rxjs';
import { delay, switchMap, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchResults: any;

  public currentUser;

  public countdown = '';
  public countDate = '2019-01-16 08:30:00';

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
    this.count();
  }

  searchField() {
    if (this.platform.platformCheck) {
      const searchField = <HTMLInputElement>document.querySelector('input[type="search"]#searchfield');
      fromEvent(searchField, 'blur').pipe(
        delay(500),
        tap((v) => {
          this.searchResults = [];
        })
      ).subscribe(() => {
        searchField.placeholder = 'Search for customers...';
        if (searchField.value.trim().length > 0) {
          searchField.classList.add('unBlurred-value');
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
        debounceTime(500),
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

  count() {
    const countDownDate = new Date(this.countDate).getTime();

    const x = setInterval(() => {
      const now = new Date().getTime();

      const distance = countDownDate - now;

      // tslint:disable-next-line:prefer-const
      let days = Math.floor(distance / (1000 * 60 * 60 * 24)),
          // tslint:disable-next-line:prefer-const
          hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes = <any>(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
          seconds = <any>Math.floor((distance % (1000 * 60)) / 1000);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      this.countdown = '❤️';

      if (days > 0) {
        this.countdown = this.countdown + days + 'd ';
      }

      this.countdown = this.countdown + hours + ':' + minutes + ':' + seconds;

      if (distance < 0) {
        clearInterval(x);
        this.countdown = null;
      }
    }, 1000);
  }

}
