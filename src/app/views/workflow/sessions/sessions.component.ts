import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { MaterialService } from '../../../common/services/material.service';

import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  tabstatus: SessionTabs = 'provisional';
  tabbar: any;

  constructor(
    private mdc: MaterialService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initTab();
    this.cdRef.detectChanges();
    this.changeTab();
    this.route.queryParams.pipe(
      filter(params => params.status)
    ).subscribe(params => {
      this.tabstatus = params.status;
    });
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

  changeTab() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(event => {
        return this.route.queryParams;
      }),
      filter(params => params.status)
    ).subscribe(params => {
      this.tabstatus = params.status;
    });
  }

}

export type SessionTabs = 'create' | 'provisional' | 'inprogress' | 'archived';
