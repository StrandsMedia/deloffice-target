import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'newdate'
})
export class NewDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) { }

  transform(date: string, pattern?: string): any {
    if (date) {
      if (date !== '0000-00-00' && date !== '0000-00-00 00:00:00') {
        const somdate = new Date(date);
        return this.datePipe.transform(somdate, pattern);
      }
    }

    return '-';
  }

}
