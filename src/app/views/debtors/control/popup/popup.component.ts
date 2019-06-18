import { Component, OnInit, Input, Output, OnChanges, EventEmitter, DoCheck } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

import { QuestionBase } from '../../../workflow/popup/utils/question-base';
import { QuestionControlService } from '../../../workflow/popup/utils/question-control.service';
import { AllValidationErrors, getFormValidationErrors } from 'src/app/common/utils/validation.errors';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-control-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnChanges, DoCheck {
  @Input() questions: QuestionBase<any>[] = [];
  @Output() update = new EventEmitter<any>();
  form: FormGroup;
  payLoad = '';
  errors = '';

  constructor(private qcs: QuestionControlService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.questions) {
      this.form = this.qcs.toControlForm(this.questions);
      this.payLoad = this.form.value;
    }
  }

  ngDoCheck() {
    if (this.questions) {
      if (this.form.value !== this.payLoad) {
        this.updateForm();
      }
      if (this.form) {
        if (!this.form.valid) {
          const error: AllValidationErrors = getFormValidationErrors(this.form.controls).shift();
          if (error) {
            let text;
            switch (error.error_name) {
              case 'required': text = `${error.control_name} is required!`; break;
              case 'pattern': text = `${error.control_name} has wrong pattern!`; break;
              case 'email': text = `${error.control_name} has wrong email format!`; break;
              case 'areEqual': text = `${error.control_name} must be equal!`; break;
              case 'exists': text = `${error.control_name} already exists!`; break;
              default: text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;
            }
            this.errors = text;
          } else {
            this.errors = null;
          }
        } else {
          this.errors = null;
        }
      }
    }

  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

  updateForm() {
    const object = this.form.value;
    object.valid = this.form.valid;
    this.update.emit(this.form.value);
  }

}
