import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WorkflowService } from 'src/app/common/services/workflow.service';

import { QuestionBase } from './utils/question-base';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './popup-question.component.html',
  styleUrls: ['./popup-question.component.scss']
})
export class PopupQuestionComponent implements OnInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  vehicle = [1, 2, 3, 4, 5, 6, 7];

  papers: Observable<any>;

  paperarr: string[] = ['paper1', 'paper2', 'paper3', 'paper4', 'paper5'];

  constructor(private wf: WorkflowService) { }

  ngOnInit() {
    this.get();
    this.paperarr.forEach(paper => {
      if (this.question.key === paper) {
        if (this.question.value) {
          this.form.controls[paper].setValue(this.question.value);
        }
      }
    });
  }

  get() {
    return this.papers = this.wf.readPaper().pipe(
      map(paper => paper.records)
    );
  }

  bindVal(item, $event) {
    const fd = new FormData()
    fd.append('file', <File>$event.target.files[0], 'file');
    console.log(item)
    item.value = fd;
  }

}
