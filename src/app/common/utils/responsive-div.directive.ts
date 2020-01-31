import { Directive, OnInit, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { fromEvent, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[responsive]'
})
export class ResponsiveDIVDirective implements AfterViewInit, OnDestroy {
  private _el;
  private _previousHeight;
  private _notifier = new Subject<boolean>();

  constructor(private _ref: ElementRef, @Inject(PLATFORM_ID) private _platformID: any) {
    this._el = _ref.nativeElement as HTMLDivElement;
  }

  ngAfterViewInit() {
    this.stretchHeight();
    this._previousHeight = this.height;
    if (isPlatformBrowser(this._platformID)) {
      fromEvent(window, 'resize').pipe(
        takeUntil(this._notifier)
      ).subscribe((data) => {
        if (this._previousHeight !== this.height) {
            this.stretchHeight();
            this._previousHeight = this.height;
        }
      });
    }
  }

  ngOnDestroy() {
    this._notifier.next(true);
  }
  
  public stretchHeight() {
    if (isPlatformBrowser(this._platformID)) {
      this.body.style.height = `${this.height}px`;
      this.body.style.maxHeight = `${this.height}px`;
    }
  }

  public get height(): number {
    if (isPlatformBrowser(this._platformID)) {
        const body = this._el as HTMLDivElement;
        let height = (document.documentElement.clientHeight - body.getBoundingClientRect().top) - 50;
        height = Number(height.toFixed(0));
        return height;
    }
  }

  public get body(): HTMLElement {
    return this._el as HTMLDivElement;
  }

}
