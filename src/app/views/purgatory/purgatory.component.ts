import { Component, OnInit } from '@angular/core';

import { OrdersService } from '../../common/services/orders.service';

@Component({
  selector: 'app-purgatory',
  templateUrl: './purgatory.component.html',
  styleUrls: ['./purgatory.component.scss']
})
export class PurgatoryComponent implements OnInit {

  constructor(
    private _order: OrdersService
  ) { }

  ngOnInit() {

  }

  get() {

  }

  public trackByFn(index, item) {
    return index;
  }
}
