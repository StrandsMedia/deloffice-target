import { Directive, ElementRef, DoCheck, Input } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AuthGroup } from './authorization.types';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[clickDisabled]'
})
export class ClickDisableUnauthDirective implements DoCheck {
  @Input('clickDisabled') permission: AuthGroup;

  constructor(
    private _el: ElementRef,
    private _authorize: AuthorizationService
  ) { }

  ngDoCheck(): void {
    if (!this._authorize.hasPermission(this.permission)) {
      this._el.nativeElement.style.pointerEvents = 'none';
      this._el.nativeElement.style.cursor = 'not-allowed';
    } else {
      this._el.nativeElement.style.pointerEvents = 'auto';
      this._el.nativeElement.style.cursor = 'pointer';
    }
  }

}
