import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { CustomerService } from 'src/app/common/services/customer.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-allocs',
  templateUrl: './allocs.component.html',
  styleUrls: ['./allocs.component.scss']
})
export class AllocsComponent implements OnInit, AfterViewInit {
  allocs: Observable<any>;
  @Input() data: any;

  columns = [
    { id: 'code', name: 'Code', width: '12%' },
    { id: 'date', name: 'Date', width: '13%' },
    { id: 'ref', name: 'Ref.', width: '20%' },
    { id: 'des', name: 'Descrip.', width: '25%' },
    { id: 'debit', name: 'DR', width: '10%' },
    { id: 'credit', name: 'CR', width: '10%' },
    { id: 'out', name: 'Outstd', width: '10%' }
  ];

  constructor(
    private cust: CustomerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.get();
  }

  ngAfterViewInit() {
    //
  }

  get() {
    this.route.params.forEach((params: Params) => {
      this.allocs = this.cust.getAllocs(this.data).pipe(
        map((res: any) => {
          const recs = res['records'].sort((a, b) => {
            return a['AutoIdx'] === b['cAllocs'];
          });
          console.log(recs);
          return res;
        })
      );
    });
  }

}
