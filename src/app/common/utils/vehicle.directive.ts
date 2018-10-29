import { Directive, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[vehicle]'
})
export class VehicleDirective implements OnInit, AfterViewInit {
  private el;

  vehicles = [
    '4730 ZR 01',
    '5271 ZR 02',
    '629 MR 03',
    '3213 ZU 04',
    '3652 ZT 04',
    '2772 ZV 05',
    '5027 ZR 06'
  ];

  constructor(private ref: ElementRef) {
    this.el = ref.nativeElement;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.vehicles.includes(this.el.innerText)) {
      const txt = this.el.innerText;
      this.el.innerText = null;
      const wrapper = document.createElement('div') as HTMLElement,
            t = document.createTextNode(txt);
      wrapper.appendChild(t);
      wrapper.classList.add('vehicle');
      this.el.appendChild(wrapper);
    }
  }

}
