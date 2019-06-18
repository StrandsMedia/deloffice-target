import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'session'
})
export class SessionPipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) {
      return null;
    }

    value = Number(value);

    switch (value) {
      case 0:
        return 'Provisional';
      case 1:
        return 'Final';
      case 2:
        return 'Pickup';
      case 3:
        return 'Archive';
      case 4:
        return 'Archive';
    }
  }

}
