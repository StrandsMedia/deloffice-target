import { Directive, ElementRef, DoCheck, Input } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AuthGroup } from './authorization.types';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[hideIfUnauth]'
})
export class HideUnauthDirective implements DoCheck {
  @Input('hideIfUnauth') permission: AuthGroup;

  constructor(
    private _el: ElementRef,
    private _authorize: AuthorizationService
  ) { }

  ngDoCheck(): void {
    if (!this._authorize.hasPermission(this.permission)) {
      this._el.nativeElement.style.display = 'none';
    } else {
      this._el.nativeElement.style.display = 'block';
    }
  }

}
