import { Component, OnInit } from '@angular/core';

import { OrdersService } from '../../../common/services/orders.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  dataSource$: Observable<any>;
  loading = false;
  columns: [
    'tempid',
    'wfid',
    'date',
    'customer',
    'itemcount',
    'poref',
    'invno',
    'total',
    'notes',
    'user',
    'edit'
  ];

  constructor() { }

  ngOnInit() {
  }

  trackByFn(index, item) {
    return index;
  }

}
