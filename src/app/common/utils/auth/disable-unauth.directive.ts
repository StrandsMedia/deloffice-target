import { Directive, ElementRef, Input, DoCheck } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AuthGroup } from './authorization.types';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[disableIfUnauth]'
})
export class DisableUnauthDirective implements DoCheck {
  @Input('disableIfUnauth') permission: AuthGroup;

  constructor(
    private _el: ElementRef,
    private _authorize: AuthorizationService
  ) { }

  ngDoCheck() {
    if (!this._authorize.hasPermission(this.permission)) {
      this._el.nativeElement.disabled = true;
    } else {
      this._el.nativeElement.disabled = false;
    }
  }

}
