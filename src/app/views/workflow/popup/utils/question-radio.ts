import { QuestionBase } from './question-base';

export class RadioQuestion extends QuestionBase<string> {
  controlType = 'radio';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || 'radio';
  }
}
