import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'reverse' })

export class ReversePipe implements PipeTransform {
  transform(value: Array<any>) {
    if (value) {
      return value.slice().reverse();
    }

    return;
  }
}
