import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from 'src/app/common/services/customer.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() data: any;
  dataSource$: Observable<any>;

  public status = [
    { name: 'Potential' },
    { name: 'Target' },
    { name: 'Regular' },
    { name: 'Erratic' },
    { name: 'Tender' },
    { name: 'Bin' },
  ];

  constructor(
    private cust: CustomerService,
    private mdc: MaterialService
  ) { }

  ngOnInit(): void {
    this.get();
  }

  get() {
    return this.dataSource$ = this.cust.getStatus(this.data.cust_id);
  }

  changeStatus(index, $event: Event) {
    $event.preventDefault();
    const object = {
      cust_id: +this.data.cust_id,
      pf_id: +index,
      status: +(($event.target) as any).value
    };

    this.cust.updateStatus(object).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
      }
    );
  }
}
