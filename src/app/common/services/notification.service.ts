import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { of, timer, Observable } from 'rxjs';
import { delay, switchMap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Quote

  getQuote(): Observable<any> {
    return this.http.get('http://quotes.rest/qod.json?category=inspire');
  }

  // Reminders

  createReminder(info) {
    return this.http.post(this.url + 'notification/create.php', info);
  }

  getReminderList(info) {
    return this.http.post(this.url + 'notification/read.php', info);
  }

  getReminder(info) {
    // Return a long polling observable that asks the PHP script to re-render the data every 10 seconds.
    return timer(0, 3000).pipe(
      switchMap((v) => {
        return this.http.post(this.url + 'notification/remindme.php', info);
      }),
      retry(2)
    );
  }

  dismiss(info) {
    return this.http.post(this.url + 'notification/dismiss.php', info);
  }

  snooze(info) {
    return this.http.post(this.url + 'notification/snooze.php', info);
  }

  // Tasks

  createTask(info) {
    return this.http.post(this.url + 'tasks/create.php', info);
  }

  getTasks(info) {
    return this.http.post(this.url + 'tasks/read.php', info);
  }

  markDone(info) {
    return this.http.post(this.url + 'tasks/markDone.php', info);
  }

  markKnown(info) {
    return this.http.post(this.url + 'tasks/markAsKnown.php', info);
  }

  // Browser Notifications

  checkInstance() {
    if (!Notification) {
      console.log('Your browser does not support notifications');
    } else {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  }

  notifyMe(info) {
    const { title, body } = info;
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    } else {
      const notification = new Notification(title, {
        body: body
      });
    }
  }


}
