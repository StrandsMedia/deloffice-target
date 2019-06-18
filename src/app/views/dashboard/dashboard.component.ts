import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { ReportService } from 'src/app/common/services/report.service';

import Chart from 'chart.js';

import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  today = new Date();
  @ViewChild('qtyChartRef', { static: true }) private qtyChartRef: ElementRef;
  qtyChart: Chart;
  qtyData: any;
  user;

  public quote$: Observable<any>;

  choice = 'self';

  users: Observable<any>;

  reminders: Observable<any>;
  tasks: Observable<any>;

  public reminderForm: FormGroup = this.fb.group({
    user: null,
    status: 0
  });

  public taskForm: FormGroup = this.fb.group({
    user: null,
    num: 0
  });

  public qtyReportForm: FormGroup = this.fb.group({
    product: 'paper'
  });

  public newTaskForm: FormGroup = this.fb.group({
    taskname: [null, Validators.required],
    user: ['', [Validators.required, Validators.minLength(1)]],
    assignedTo: ['', [Validators.required, Validators.minLength(1)]]
  });

  public newReminderForm: FormGroup = this.fb.group({
    reminder_name: [null, Validators.required],
    reminder_date: [null, Validators.required],
    reminder_time: [null, Validators.required],
    user: [null, Validators.required]
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private mdc: MaterialService,
    private ntn: NotificationService,
    private rpt: ReportService
  ) {
    auth.currentUser.subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.keepRunning();
    this.getReminders();
    this.getTasks();
    this.users = this.auth.getUsers().pipe(
      map(res => res.records),
      map((user: []) => {
        const newarr = user.filter(usr => {
          if (usr['status'] === '1') {
            return usr;
          }
        });
        return user;
      })
    );
  }

  ngAfterViewInit() {
    this.get();
    this.quote$ = this.ntn.getQuote();
  }

  ngOnDestroy() {
    clearTimeout(this.keepRunning());
  }

  trackByFn(index, item) {
    return index;
  }

  get() {
    this.qtyData = null;
    this.qtyData = this.rpt.getSalesMonth(this.qtyReportForm.value.product).pipe(
      tap((data: any) => {
        this.drawQtyChart(data);
      })
    );
  }

  getReminders() {
    this.reminderForm.controls['user'].setValue(this.user.user_id);
    this.reminders = this.ntn.getReminderList(this.reminderForm.value);
  }

  getTasks() {
    this.taskForm.controls['user'].setValue(this.user.user_id);
    this.tasks = this.ntn.getTasks(this.taskForm.value);
  }

  addNewTask() {
    this.ntn.createTask(this.newTaskForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.getTasks();
      }
    );
  }

  addNewReminder() {
    const remForm = this.newReminderForm.value;
    const datetime = this.formatDate(new Date(remForm.reminder_date + ' ' + remForm.reminder_time));
    const postObj = {
      reminder_name: remForm.reminder_name,
      reminder_time: datetime,
      user: remForm.user
    };

    this.ntn.createReminder(postObj).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.getReminders();
      }
    );
  }

  formatDate(d = new Date) {
    let day = String(d.getDate());
    let month = String(d.getMonth() + 1);
    const year = String(d.getFullYear());

    let hour = String(d.getHours());
    let minute = String(d.getMinutes());
    let seconds = String(d.getHours());

    // tslint:disable-next-line:curly
    if (month.length < 2) month = '0' + month;
    // tslint:disable-next-line:curly
    if (day.length < 2) day = '0' + day;
    // tslint:disable-next-line:curly
    if (hour.length < 2) hour = '0' + hour;
    // tslint:disable-next-line:curly
    if (minute.length < 2) minute = '0' + minute;
    // tslint:disable-next-line:curly
    if (seconds.length < 2) seconds = '0' + seconds;

    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }

  markDone(row) {
    const obj = {
      task_id: row.task_id
    };
    let action;

    const prompt = confirm('Confirm task completed ?');

    if (prompt) {
      if (row.user == row.assignedTo) {
        action = this.ntn.markDone(obj);
      } else {
        action = this.ntn.markKnown(obj);
      }

      action.subscribe(
        (data) => {
          this.mdc.materialSnackBar(data);
        },
        (err) => {
          this.mdc.materialSnackBar(err.error);
        },
        () => {
          this.getTasks();
        }
      );
    }

  }

  keepRunning() {
    return setInterval(() => {
      this.today = new Date();
    }, 1000);
  }

  bindUser() {
    this.newTaskForm.controls['user'].setValue(this.user.user_id);
    this.newTaskForm.controls['assignedTo'].setValue(this.user.user_id);
    this.newReminderForm.controls['user'].setValue(this.user.user_id);
  }

  drawQtyChart(data: Array<any>) {
    if (data) {
      const dataline = [];
      const dataset = [];
      data.forEach((dt, idx) => {
        dataline.push(dt.month);
        dataset.push(dt.qty);
      });

      this.qtyChart = new Chart(this.qtyChartRef.nativeElement, {
        type: 'bar',
        label: 'Monthly Comparison Chart',
        data: {
          labels: dataline, // your labels array
          datasets: [
            {
              label: 'Sales Qty',
              data: dataset, // your data array
              backgroundColor: 'rgba(0, 174, 255, 0.5)',
              borderColor: 'rgba(0, 174, 255, 1)',
              fill: false
            },
            {
              type: 'line',
              label: 'Sales Qty',
              data: dataset, // your data array
              backgroundColor: '#00AEFF',
              borderColor: '#00AEFF',
              fill: false
            },

          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true,
              fontSize: 10,
              ticks: {
                autoSkip: false
              },
            }],
            yAxes: [{
              display: true,
              fontSize: 10,
              ticks: {
                beginAtZero: true,
                autoSkip: true
              },
            }],
          }
        }
      });
    }
  }

  get timeOfDay() {
    const h = this.today.getHours();

    if (h >= 6 && h <= 12) {
      return {msg: 'Good morning, ' + this.user.username + ' !', time: 'day'};
    } else if (h >= 12 && h <= 18) {
      return {msg: 'Good afternoon, ' + this.user.username + ' !', time: 'midday'};
    } else if (h >= 18 && h <= 23) {
      return {msg: 'Good evening, ' + this.user.username + ' !', time: 'night'};
    } else {
      return {msg: 'Hello, ' + this.user.username + ' !', time: 'night'};
    }
  }

}
