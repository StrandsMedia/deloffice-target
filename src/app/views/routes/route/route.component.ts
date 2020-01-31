import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

import { RoutesService } from 'src/app/common/services/routes.service';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {
  loading: boolean;
  dataSource$: Observable<any>;
  route: Observable<any>;
  searchString: string;

  columns = [
    'locationId',
    'locationRef',
    'locationName',
    'rank',
    'buttons'
  ];
  location$: Observable<any>;
  private _id: any;
  private _locations: any[];

  constructor(
    private fb: FormBuilder,
    private routes: RoutesService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.get();
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    return this.dataSource$ = this._route.params.pipe(
      switchMap(params => {
        this._id = +params['id'];
        return this.routes.getRoute(+params['id']);
      }),
      tap((data) => {
        this._locations = data.locations
      })
    )
  }

  addToRoute(info) {
    let obj = {
      routeId: this._id,
      locationId: info.locationId
    };
    this.routes.addLocation(obj).subscribe(
      (data) => {

      },
      (err) => {

      },
      () => {
        this.get();
      }
    )
  }

  fetchLocations() {
    this.location$ = this.routes.getLocation().pipe(
      tap((data) => console.log(data))
      // map((locations: any) => {
      //   return locations.records.filter(value => -1 !== this._locations.indexOf(value.locationId))
      // })
    );
  }

  switchRankDown(data: any[], index) {
    const obj = {
      case: 1,
      routelocId1: data[index].routelocId,
      rank1: data[index].rank,
      routelocId2: data[index + 1].routelocId,
      rank2: data[index + 1].rank
    }
    console.log(obj)
    this.routes.switchPlace(obj).subscribe(
      (data) => {

      },
      (err) => {

      },
      () => {
        this.get();
      }
    )
  }

  switchRankUp(data: any[], index) {
    const obj = {
      case: 2,
      routelocId1: data[index].routelocId,
      rank1: data[index].rank,
      routelocId2: data[index - 1].routelocId,
      rank2: data[index - 1].rank
    }
    console.log(obj)
    this.routes.switchPlace(obj).subscribe(
      (data) => {

      },
      (err) => {

      },
      () => {
        this.get();
      }
    )
  }

}
