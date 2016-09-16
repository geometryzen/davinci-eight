export default class Float {
    value: number;
    constructor(value: number) {
        this.value = value;
    }

    getString() {
        return this.value.toFixed(3);
    }

    uniformType() {
        return 'float';
    }

    uniformValue() {
        return [this.value];
    }

    uniformMethod() {
        return '1f';
    }
}
