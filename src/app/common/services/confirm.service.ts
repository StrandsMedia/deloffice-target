import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor() { }

  confirm(message?: string): Observable<boolean> {
    const { confirm } = window;
    const prompt = confirm(message || 'Are you sure?')

    return of(prompt)
  }


}
