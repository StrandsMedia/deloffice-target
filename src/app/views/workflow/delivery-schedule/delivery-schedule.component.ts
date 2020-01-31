import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-delivery-schedule',
  templateUrl: './delivery-schedule.component.html',
  styleUrls: ['./delivery-schedule.component.scss']
})
export class DeliveryScheduleComponent implements OnInit {
  public toDate = new Date();

  invoices = [
    'INV000001',
    'INV000002',
    'INV000003',
    'INV000004',
    'INV000005',
    'INV000006',
    'INV000007',
    'INV000008'
  ]

  routes = [
    
  ]

  constructor() { }

  ngOnInit() {
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  public enter(event) {
    console.log(event)
  }

  public get days(): string[] {
    let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayArr = [];
    for (let i = 0; i < 8; i++) {
      let date = new Date((new Date().setDate(new Date().getDate() + i))).getDate()
      let dayIndex = new Date((new Date().setDate(new Date().getDate() + i))).getDay()
      if (dayIndex !== 0) {
        dayArr.push(`${(dayNames[dayIndex]).slice(0, 3)} ${date}`)
      }
    }
    return dayArr;

  }

  public get currentDay(): string {
    let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date = new Date().getDate()
    let dayIndex = new Date().getDay()
    
    if (dayIndex !== 0) {
      return `${dayNames[dayIndex].slice(0, 3)} ${date}`
    }
  }

}
