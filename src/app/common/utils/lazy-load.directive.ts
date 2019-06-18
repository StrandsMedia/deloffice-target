import { Directive, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[lazy-load]'
})
export class LazyLoadDirective implements OnInit, AfterViewInit {
  private el;

  constructor(private ref: ElementRef) {
    this.el = ref.nativeElement;
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    const targets = document.querySelectorAll('.prod-card');
    targets.forEach(this.lazyLoad);
  }

  lazyLoad(target) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const img = card.children[0];
          const src = img.getAttribute('data-lazy');

          img.setAttribute('src', src);
          card.classList.add('fade-card');

          observer.disconnect();
        }
      });

    });
    io.observe(target);
  }


}
