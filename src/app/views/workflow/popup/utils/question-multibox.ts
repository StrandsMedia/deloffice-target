import { QuestionBase } from './question-base';

export class MultiboxQuestion extends QuestionBase<string> {
  controlType = 'multibox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
