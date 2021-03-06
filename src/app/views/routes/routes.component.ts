import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

import { RoutesService } from 'src/app/common/services/routes.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {
  loading: boolean;
  dataSource$: Observable<any>;
  route: Observable<any>;

  columns = [
    'routeId',
    'routeRef',
    'routeName',
    'createdAt',
    'updatedAt'
  ];

  public searchForm = this.fb.group({
    route: ['']
  });

  public addForm = this.fb.group({
    routeRef: null,
    routeName: [null, Validators.required]
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
    return this.dataSource$ = this.routes.getRoute();
  }

  addNew() {
    const route: string = this.addForm.value.routeName;
    this.addForm.value.routeRef = route.replace(' ', '').toUpperCase().slice(0,3);
    this.routes.createRoute(this.addForm.value).subscribe(
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