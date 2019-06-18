import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../../workflow/popup/utils/question-base';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-popques',
  templateUrl: './popques.component.html',
  styleUrls: ['./popques.component.scss']
})
export class PopquesComponent implements OnInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
