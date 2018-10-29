import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() title: string;
  @Input() dialogID: string;

  @Input() cancel?: string;
  @Input() accept?: string;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancel?: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAccept?: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  cancelClicked(value: boolean) {
    this.onCancel.emit(value);
  }

  acceptClicked(value: boolean) {
    this.onAccept.emit(value);
  }

}
