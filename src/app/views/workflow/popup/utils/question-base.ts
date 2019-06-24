export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    status: number | number[];
    controlType: string;
    order: number;
    placeholder?: string;
    extra?: boolean;
    pattern?: string;
    length?: number;
    type?: string;

    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        status?: number,
        controlType?: string,
        order?: number,
        placeholder?: string,
        extra?: boolean,
        pattern?: string
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.status = options.status;
        this.controlType = options.controlType || '';
        this.order = options.order;
        this.placeholder = options.placeholder || null;
        this.extra = options.extra || null;
        this.pattern = options.pattern || null;
    }
}
