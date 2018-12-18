import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(date: string): string {
    if (date) {
      const format = new Date(date) as any;
      const today = new Date() as any;
      const days = Math.round((today - format) / (1000 * 60 * 60 * 24));

      if (days <= 30) {
        return 'Current';
      } else if (days > 30 && days <= 60) {
        return '30 days';
      } else if (days > 60 && days <= 90) {
        return '60 days';
      } else if (days > 90 && days <= 120) {
        return '90 days';
      } else if (days > 120 && days <= 150) {
        return '120 days';
      } else if (days > 150 && days <= 180) {
        return '150 days';
      } else if (days > 180) {
        return '180 days';
      }
    }

  }

}
