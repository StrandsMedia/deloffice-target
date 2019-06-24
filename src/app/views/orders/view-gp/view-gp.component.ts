import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Params } from '@angular/router';

// import { Observable } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-gp',
  templateUrl: './view-gp.component.html',
  styleUrls: ['./view-gp.component.scss']
})
export class ViewGPComponent implements OnInit {
  // Hello Coosoom ^_^ !

  // You need to use an Observable to put the data inside it
  // public invoice$: Observable<any>;

  // You will also need columns for your table
  // public columns = [];

  // public confirm: boolean;
  // public verify: boolean;

  constructor() { }

  ngOnInit() {
  }

  // You need a getter function for the data
  get() {
    // Use the observable to assign it to the data from the service
  }

  //OK SIR :D

  // public toggleConfirmMode() {
  //   this.confirm = !this.confirm;
  // }

  // public toggleVerifyMode() {
  //   this.confirm = !this.confirm;
  // }
}
