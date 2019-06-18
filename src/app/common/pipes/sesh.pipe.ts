import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sesh'
})
export class SeshPipe implements PipeTransform {

  transform(value: any): string {
    if (value !== undefined) {
      switch (+value) {
        case 0:
          return 'Provisional Session';
          break;
        case 1:
          return 'Session In Delivery';
          break;
        case 2:
          return 'Pickup Session';
          break;
        case 3:
          return 'Closed Delivery Session';
          break;
        case 4:
          return 'Closed Pickup Session';
          break;
      }
    }
    return null;
  }

}
