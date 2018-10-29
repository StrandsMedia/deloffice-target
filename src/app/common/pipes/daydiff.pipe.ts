import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daydiff'
})
export class DaydiffPipe implements PipeTransform {
  transform(value: string): any {
    const now = new Date() as any;
    const date = new Date(value) as any;
    const years = Math.round((now - date) / (1000 * 60 * 60 * 24 * 7 * 4 * 12));
    const months = Math.round((now - date) / (1000 * 60 * 60 * 24 * 7 * 4));
    const weeks = Math.round((now - date) / (1000 * 60 * 60 * 24 * 7));
    const days = Math.round((now - date) / (1000 * 60 * 60 * 24));
    const hours = Math.round((now - date) / (1000 * 60 * 60));
    const mins = Math.round((now - date) / (1000 * 60));
    let timediff;

    if (mins % 1 === 0 && mins > 30) {
      if (mins > 60) {
        timediff = hours + ' hour';
        if (hours > 1) {
          timediff = timediff + 's';
        }
        if (hours > 24) {
          timediff = days + ' day';
          if (days > 1) {
            timediff = timediff + 's';
          }
        }

        if (days > 7) {
          timediff = weeks + ' week';
          if (weeks > 1) {
            timediff = timediff + 's';
          }
        }

        if (weeks > 4) {
          timediff = months + ' month';
          if (months > 1) {
            timediff = timediff + 's';
          }
        }
      } else {
        timediff = mins + ' minute';
        if (mins > 1) {
          timediff = timediff + 's';
        }
      }
    } else {
      timediff = -1;
    }

    return timediff;
  }

}
