import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: Array<any>, args?: string): Array<any> {
    if (!value) {
      return null;
    } else {
      return value.sort((a, b) => {
        if (a[args] < b[args]) {
          return -1;
        }
        if (a[args] > b[args]) {
            return 1;
        }
        return 0;
      });
    }
  }

}
