import { Component, OnInit } from '@angular/core';

import { MaterialService } from '../../../common/services/material.service';
import { Navigation } from '../../../common/interfaces/navigation';
import { slideAnimation, fadeAnimation } from '../../../common/interfaces/animations';

import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [ slideAnimation, fadeAnimation ]
})
export class MainComponent implements OnInit {
  drawer;
  public nav: any = Navigation;

  constructor(private mdc: MaterialService) { }

  ngOnInit() {
    this.drawerControls();
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  drawerControls() {
    this.drawer = this.mdc.materialDrawer('aside#drawer', 'button#menu');

    fromEvent(this.drawer.button, 'click').subscribe(() => {
      this.drawer.drawer.open = !this.drawer.drawer.open;
    });

    fromEvent(this.drawer.listEl, 'click').subscribe(() => {
      this.drawer.drawer.open = !this.drawer.drawer.open;
    });

    fromEvent(this.drawer.body, 'click').subscribe(() => {
      this.drawer.drawer.open ? this.drawer.drawer.open = false : this.drawer.drawer.open = false;
    });
  }

}
