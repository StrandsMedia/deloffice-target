import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paper'
})
export class PaperPipe implements PipeTransform {

  transform(value: number): any {
    const boxCount = value / 5;

    if (boxCount % 1 === 0) {
      if (boxCount === 1) {
        return boxCount + ' box';
      }

      return boxCount + ' boxes';
    } else {
      const numarray = (boxCount.toString()).split('.');
      let a = new Array();
      a = numarray;
      const b = (Number(a[1]) * 5) / 10;

      if (a[0] === '0') {
        if (b === 1) {
          return b + ' ream';
        }
        return b + ' reams';
      } else {
        if (a[0] === '1') {
          return a[0] + ' box + ' + b + ' reams';
        }
        return a[0] + ' boxes + ' + b + ' reams';
      }
    }
  }

}
