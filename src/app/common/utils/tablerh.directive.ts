import { Directive, OnInit, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { fromEvent, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[respHeight]'
})
export class TablerhDirective implements OnInit, AfterViewInit, OnDestroy {
  private el;
  private previousHeight;
  notifier = new Subject<boolean>();

  constructor(private ref: ElementRef, @Inject(PLATFORM_ID) private platformID: any) {
    this.el = ref.nativeElement as HTMLTableElement;
  }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit() {
    this.stretchHeight();
    this.previousHeight = this.height;
    if (isPlatformBrowser(this.platformID)) {
      fromEvent(window, 'resize').pipe(
        takeUntil(this.notifier)
      ).subscribe((data) => {
        if (this.previousHeight !== this.height) {
            this.stretchHeight();
            this.previousHeight = this.height;
        }
      });
    }
  }

  ngOnDestroy() {
    this.notifier.next(true);
  }

  stretchHeight() {
    if (isPlatformBrowser(this.platformID)) {
      this.tableBody.style.height = `${this.height}px`;
      this.tableBody.style.maxHeight = `${this.height}px`;
    }
  }

  get height(): number {
    if (isPlatformBrowser(this.platformID)) {
        const tbody = ((this.el as HTMLElement).children[1]) as HTMLElement;
        let height = (document.documentElement.clientHeight - tbody.getBoundingClientRect().top) - 50;
        height = Number(height.toFixed(0));
        return height;
    }
  }

  get tableBody(): HTMLElement {
    const tbody = ((this.el as HTMLElement).children[1]) as HTMLElement;
    return tbody;
  }

}
