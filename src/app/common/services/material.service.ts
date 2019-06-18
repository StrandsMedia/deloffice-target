import { Injectable, Inject } from '@angular/core';

import { MDCDrawer } from '@material/drawer';
import { MDCList } from '@material/list';
import { MDCTabBar } from '@material/tab-bar';
import { MDCSnackbar, MDCSnackbarFoundation } from '@material/snackbar';

import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private platform: PlatformService) { }

  materialDrawer(drawEl: string, buttEl: string) {
    if (this.platform.platformCheck) {
      const drawer = new MDCDrawer(document.querySelector(drawEl));
      const button = document.querySelector(buttEl);
      const listEl = document.querySelector(drawEl + ' .mdc-list');
      const body = document.querySelector('.mdc-drawer-app-content');
      return { drawer, button, listEl, body };
    }
  }

  materialTabBar(tabEl: string) {
    if (this.platform.platformCheck) {
      const tabBar = new MDCTabBar(document.querySelector(tabEl));
      return tabBar;
    }
  }

  materialSnackBar(data) {
    if (this.platform.platformCheck) {
      const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
      snackbar.labelText = data.message;
      snackbar.actionButtonText = null;

      snackbar.open();
    }
  }

  materialList() {
    if (this.platform.platformCheck) {
      const list = new MDCList(document.querySelector('.mdc-list'));
      list.singleSelection = true;
      return list;
    }
  }


}
