import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { MaterialService } from '../../services/material.service';
import { NotificationService } from '../../services/notification.service';

import { Observable, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  reminders: Observable<any>;
  user: any;
  selectedRem: any;
  notifier = new Subject<boolean>();
  presence = false;

  public snoozeForm: FormGroup = this.fb.group({
    time: [null, Validators.required]
  });

  constructor(
    private auth: AuthService,
    private date: DatePipe,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private ntf: NotificationService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit() {
    this.get();
  }

  ngOnDestroy() {
    this.notifier.next(true);
  }

  get() {
    if (this.user) {
      const object = {
        user: this.user.user_id,
        status: 0
      };
      this.reminders = this.ntf.getReminder(object).pipe(
        tap((rem: any) => {
          if (rem.records) {
            if (rem.records.length > 0) {
              if (!this.presence) {
                const sound = new Audio('assets/sounds/ding.mp3');
                sound.loop = false;
                sound.play();

                (rem.records).forEach(reminder => {
                  this.ntf.notifyMe({
                    title: reminder.reminder_name
                  });
                });

                this.presence = true;
              }
            } else {
              this.presence = false;
            }
          }
        }),
        map((rem: any) => {
          if (rem.records) {
            return rem.records;
          }
          return rem;
        }),
        takeUntil(this.notifier)
      );
    }
  }

  dismiss() {
    const object = {
      reminder_id: this.selectedRem.reminder_id,
      status: 1
    };
    this.ntf.dismiss(object).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.selectedRem = null;
      }
    );
  }

  assignRem(rem) {
    this.selectedRem = rem;
  }

  cancel() {
    this.selectedRem = null;
  }

  snooze() {
    const object = {
      reminder_id: this.selectedRem.reminder_id,
      reminder_time: this.snoozeDate,
      status: 1
    };
    this.ntf.snooze(object).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.selectedRem = null;
      }
    );
  }

  get snoozeDate() {
    if (this.selectedRem) {
      const date = new Date();
      const date2 = this.date.transform(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

      const oldtime = this.date.transform(new Date(this.selectedRem.reminder_time), 'hh:mm:ss');

      return new Date((date2) + ' ' + oldtime);
    }
    return null;
  }

  //

}
