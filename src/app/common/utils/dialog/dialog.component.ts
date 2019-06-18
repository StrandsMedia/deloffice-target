import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() dialogID: string;
  @Input() size?: string;

  @Input() cancel?: string;
  @Input() accept?: string;

  @Input() disabled?: any;
  @Input() comment?: any;
  @Input() padd?: any;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancel?: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAccept?: EventEmitter<any> = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    //
  }

  ngOnDestroy() {
    this.disabled = null;
  }

  cancelClicked(value: boolean) {
    this.onCancel.emit(value);
  }

  acceptClicked(value: boolean) {
    this.onAccept.emit(value);
  }

  get disabledStatus() {
    if (this.disabled && this.disabled !== '') {
      return Boolean(this.disabled);
    }
    return false;
  }

}
