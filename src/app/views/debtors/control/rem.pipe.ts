import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rem'
})
export class RemPipe implements PipeTransform {
  public tabs = [
    { id: 0, name: 'TBS' },
    { id: 1, name: '1st' },
    { id: 2, name: '2nd' },
    { id: 3, name: '3rd' },
    { id: 4, name: '4th' },
    { id: 5, name: '5th' },
    { id: 6, name: '48hrs' },
    { id: 7, name: 'CC' },
  ];

  transform(value: any): string {
    if (value) {
      let idx;
      this.tabs.forEach(tab => {
        if (tab.id === value.status) {
          idx = tab.name;
        }
      });
      return idx;
    } else {
      return '-';
    }
  }

}
