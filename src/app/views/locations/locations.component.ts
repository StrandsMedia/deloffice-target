import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

import { RoutesService } from 'src/app/common/services/routes.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  loading: boolean;
  dataSource$: Observable<any>;
  location: Observable<any>;

  columns = [
    'locationId',
    'locationRef',
    'locationName',
    'createdAt',
    'updatedAt'
  ];

  public searchForm = this.fb.group({
    location: ['']
  });

  public addForm = this.fb.group({
    locationRef: null,
    locationName: null
  });

  constructor(
    private fb: FormBuilder,
    private routes: RoutesService
  ) { }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    return this.dataSource$ = this.routes.getLocation();
  }

  addNew() {
    this.routes.createLocation(this.addForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.get();
      }
    );
  }
}