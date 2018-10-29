import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { MaterialService } from '../../../common/services/material.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  tabstatus: SessionTabs = 'provisional';
  tabbar: any;

  constructor(private mdc: MaterialService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.initTab();
    this.cdRef.detectChanges();
  }

  initTab() {
    this.tabbar = this.mdc.materialTabBar('.mdc-tab-bar');
  }

}

export type SessionTabs = 'create' | 'provisional' | 'inprogress' | 'archived';
