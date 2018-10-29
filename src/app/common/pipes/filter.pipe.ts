import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, value: string): any[] {
    // tslint:disable-next-line:curly
    if (!items) return [];
    // tslint:disable-next-line:curly
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      if (!value) {
        return it.toLowerCase().startsWith(searchText);
      } else {
        return it[value].toLowerCase().startsWith(searchText);
      }
    });
  }
}
