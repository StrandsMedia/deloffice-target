import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  siteTitle = 'Target';

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {
    //
  }

  fetchTitle(overrideString?: string): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        // tslint:disable-next-line:curly
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      map((data) => {
        // tslint:disable-next-line:curly
        if (data.title) {
          return data.title;
        }
      }),
      tap((title) => {
        this.title.setTitle(title + ' | ' + this.siteTitle);
      })
    );
  }

  swapTitle(fallback: string) {
    this.title.setTitle(fallback + ' | ' + this.siteTitle);
  }
}
