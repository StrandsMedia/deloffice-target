import { QuestionBase } from './question-base';

export class SelectQuestion extends QuestionBase<string> {
  controlType = 'select';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
