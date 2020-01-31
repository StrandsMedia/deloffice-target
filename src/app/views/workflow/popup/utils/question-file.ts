import { QuestionBase } from './question-base';

export class FileUploadQuestion extends QuestionBase<FormData> {
  controlType = 'fileupload';
  type: string;
  pattern: string;
  accept: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || 'file';
    this.pattern = options['pattern'] || '';
    this.accept = options['accept'];
  }
}
