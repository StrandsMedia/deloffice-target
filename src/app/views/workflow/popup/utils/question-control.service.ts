import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { SelectQuestion } from './question-select';
import { RadioQuestion } from './question-radio';
import { MultiboxQuestion } from './question-multibox';
import { QuestionChoices, ProductChoices, ControlChoices } from './questions-choices';
import { doubleChecker } from 'src/app/common/utils/unique.validator';
import { WorkflowService } from 'src/app/common/services/workflow.service';

@Injectable({
  providedIn: 'root'
})

export class QuestionControlService {
    choices = QuestionChoices;
    prod = ProductChoices;

    control = ControlChoices;

    constructor(private fb: FormBuilder, private wf: WorkflowService) { }

    // Debtors Control

    getControl(status) {
        const questions = [];
        const choices: QuestionBase<any>[] = [];

        this.control.forEach(choice => {
            if (choice.status.includes(status)) {
                choices.push(
                    new RadioQuestion({
                        key: 'status',
                        label: choice.name,
                        value: choice.value,
                        required: true,
                        status: choice.status,
                        order: choice.order
                    })
                );
            }
        });

        choices.sort((a, b) => a.order - b.order);

        questions.push(choices);

        questions.push(new TextboxQuestion({
            key: 'note',
            label: 'Line Note',
            required: false,
            order: 1,
            status: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }));

        return questions.filter((el: any) => {
            if (el.status) {
                return el.status.includes(status);
            }
            return el;
        });
    }

    toControlForm(questions: QuestionBase<any>[]): FormGroup {
        const group: any = {};

        questions.forEach((question: any) => {
            if (question.length > 0) {
                question.forEach(qu => {
                    group[qu.key] = qu.required ? new FormControl(null || '', Validators.required) : new FormControl(null || '');
                });
            } else {
                // tslint:disable-next-line:max-line-length
                group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
            }
        });

        return this.fb.group(group);
    }

    // Workflow

    getQuestions(status, data) {
        const questions = [];
        const choices: QuestionBase<any>[] = [];

        this.choices.forEach(choice => {
            if (choice.status.includes(status)) {
                choices.push(new RadioQuestion({
                    key: 'status',
                    label: choice.name,
                    value: choice.value,
                    required: true,
                    status: choice.status,
                    order: choice.order
                }));

                if ((status === 0 && choice.value === 3) || (status === 2 && choice.value === 3)) {
                    choices.push(new TextboxQuestion({
                        key: 'orderNo',
                        placeholder: 'P. O. Ref.',
                        required: false,
                        status: choice.status,
                        order: choice.order,
                        value: ' '
                    }));
                }
                if (status === 5 && choice.value === 6) {
                    choices.push(new TextboxQuestion({
                        key: 'invoiceNo',
                        placeholder: 'Invoice No.',
                        required: true,
                        status: choice.status,
                        order: choice.order,
                        pattern: '(([iI][nN][vV])+([0-9]{6}$)|([sS][oO])+([0-9]{5}$))|CANCEL'
                    }));
                }

                if (status === 7 && choice.value === 9) {
                    choices.push(new SelectQuestion({
                        key: 'vehicle',
                        required: true,
                        status: choice.status,
                        order: choice.order
                    }));
                }
            }
        });

        choices.sort((a, b) => a.order - b.order);

        questions.push(choices);

        // this.prod.forEach((prod) => {
        //     questions.push(new MultiboxQuestion({
        //         key: prod.id,
        //         label: prod.name,
        //         status: [0, 2, 5, 16],
        //         extra: prod.maxi,
        //         value: data[prod.id]
        //     }));
        // });

        questions.push(new TextboxQuestion({
            key: 'note',
            label: 'Line Note',
            required: false,
            order: 1,
            status: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }));

        questions.push(new TextboxQuestion({
            key: 'workflow_id',
            required: true,
            value: data.workflow_id,
            status: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }));

        questions.push(new TextboxQuestion({
            key: 'step',
            required: true,
            value: data.step,
            status: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }));

        return questions.filter((el: any) => {
            if (el.status) {
                return el.status.includes(status);
            }
            return el;
        });
    }

    toForm(questions: QuestionBase<any>[]): FormGroup {
        const paperarr: string[] = ['paper1', 'paper2', 'paper3', 'paper4', 'paper5'];
        const group: any = {};

        questions.forEach((question: any) => {
            if (question.length > 0) {
                question.forEach(qu => {
                    if (qu.pattern) {
                        // tslint:disable-next-line:max-line-length
                        group[qu.key] = qu.required ?
                            new FormControl(
                                (null || ''),
                                [Validators.required, Validators.pattern(qu.pattern)],
                                doubleChecker(this.wf))
                          : new FormControl(null || '');
                    } else {
                        // tslint:disable-next-line:max-line-length
                        group[qu.key] = qu.required ? new FormControl(null || '', Validators.required) : new FormControl(null || '');
                    }
                });
            } else {

                if (paperarr.includes(question.key)) {
                    group[question.key] = new FormArray([
                        new FormControl(false),
                        new FormControl(),
                        new FormControl(),
                        new FormControl()
                    ]);
                } else {
                    // tslint:disable-next-line:max-line-length
                    group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
                }
            }
        });
        return this.fb.group(group);
    }
}

