import { Directive, OnInit, Input, ElementRef } from '@angular/core';

import { MDCDialog } from '@material/dialog';

import { PlatformService } from '../../services/platform.service';

import { fromEvent } from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dialogTrigger]'
})
export class DialogDirective implements OnInit {
  private el;
  @Input() dialogTrigger: string;

  constructor(ref: ElementRef, private platform: PlatformService) {
    this.el = ref.nativeElement;
  }

  ngOnInit() {
    if (this.platform.platformCheck) {
      fromEvent(this.el, 'click').subscribe((event) => {
        const dialog = document.querySelector(`#${this.dialogTrigger}`);
        const mdcDialog = MDCDialog.attachTo(dialog);
        mdcDialog.open();
      });
    }
  }

}
