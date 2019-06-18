import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent implements OnInit {
  sector: Observable<any>;
  subsector: Observable<any>;

  constructor() { }

  ngOnInit() {
  }


}
