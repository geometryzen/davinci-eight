export default class Vector {
    value: number[];
    dim: number;
    constructor(vec: any, type?: string) {
        this.value = [0, 0];
        this.dim = 2;
        this.set(vec, type);
    }

    set(vec: any, type: string) {
        if (typeof vec === 'number') {
            type = type || 'vec2';
            this.set([vec], type);
        }
        else if (typeof vec === 'string') {
            const parts = vec.replace(/(?:#|\)|\]|%)/g, '').split('(');
            const strValues = (parts[1] || parts[0].replace(/(\[)/g, '')).split(/,\s*/);
            type = type || (parts[1] ? parts[0].substr(0, 4) : 'vec' + strValues.length);
            const values: number[] = [];
            for (let i = 0; i < strValues.length; i++) {
                values.push(parseFloat(strValues[i]));
            }
            this.set(values, type);
        }
        else if (vec) {
            if (Array.isArray(vec)) {
                this.value = [];
                this.value.length = 0;
                this.dim = type ? Number(type.substr(3, 4)) : vec.length;
                let filler = vec.length === 1 ? vec[0] : 0;
                for (let i = 0; i < this.dim; i++) {
                    this.value.push(vec[i] || filler);
                }
            }
            else if (vec.dim) {
                this.value = vec.value;
                this.dim = vec.dim;
            }
        }
    }

    set x(v: number) {
        this.value[0] = v;
    }

    set y(v: number) {
        this.value[1] = v;
    }

    set z(v: number) {
        if (this.dim < 3) {
            while (this.dim < 3) {
                this.value.push(0);
            }
            this.dim = 3;
        }
        this.value[2] = v;
    }

    set w(v: number) {
        if (this.dim < 4) {
            while (this.dim < 4) {
                this.value.push(0);
            }
            this.dim = 4;
        }
        this.value[3] = v;
    }

    get x() {
        return this.value[0] || 0.0;
    }

    get y() {
        return this.value[1] || 0.0;
    }

    get z() {
        return this.value[2] || 0.0;
    }

    get w() {
        return this.value[3] || 0.0;
    }

    getString(type: string) {
        type = type || 'vec' + this.dim;

        let len = this.dim;
        let str = '';
        let head = type + '(';
        let end = ')';

        if (type === 'array') {
            head = '[';
            end = ']';
            len = this.dim;
        }
        else {
            len = Number(type.substr(3, 4));
        }

        str = head;
        for (let i = 0; i < len; i++) {
            str += this.value[i].toFixed(3);
            if (i !== len - 1) {
                str += ',';
            }
        }
        return str += end;
    }

    uniformType() {
        return 'vec' + this.dim;
    }

    uniformValue() {
        var arr: number[] = [];
        for (let i = 0; i < this.dim; i++) {
            arr.push(this.value[i]);
        }
        return arr;
    }

    uniformMethod() {
        return this.dim + 'f';
    }

    // VECTOR OPERATIONS

    add(v: number | number[] | Vector): void {
        if (typeof v === 'number') {
            for (let i = 0; i < this.dim; i++) {
                this.value[i] = this.value[i] + v;
            }
        }
        else {
            let A = new Vector(v);
            let lim = Math.min(this.dim, A.dim);
            for (let i = 0; i < lim; i++) {
                this.value[i] = this.value[i] + A.value[i];
            }
        }
    }

    sub(v: number | number[] | Vector): void {
        if (typeof v === 'number') {
            for (let i = 0; i < this.dim; i++) {
                this.value[i] = this.value[i] - v;
            }
        }
        else {
            let A = new Vector(v);
            let lim = Math.min(this.dim, A.dim);
            for (let i = 0; i < lim; i++) {
                this.value[i] = this.value[i] - A.value[i];
            }
        }
    }

    mult(v: number) {
        if (typeof v === 'number') {
            // Mulitply by scalar
            for (let i = 0; i < this.dim; i++) {
                this.value[i] = this.value[i] * v;
            }
        }
        else {
            // Multiply two vectors
            let A = new Vector(v);
            let lim = Math.min(this.dim, A.dim);
            for (let i = 0; i < lim; i++) {
                this.value[i] = this.value[i] * A.value[i];
            }
        }
    }

    div(v: number) {
        if (typeof v === 'number') {
            // Mulitply by scalar
            for (let i = 0; i < this.dim; i++) {
                this.value[i] = this.value[i] / v;
            }
        }
        else {
            // Multiply two vectors
            let A = new Vector(v);
            let lim = Math.min(this.dim, A.dim);
            for (let i = 0; i < lim; i++) {
                this.value[i] = this.value[i] / A.value[i];
            }
        }
    }

    normalize() {
        let l = this.getLength();
        this.div(l);
    }

    getAdd(v: number) {
        var A = new Vector(this);
        A.add(v);
        return A;
    }

    getSub(v: number | number[] | Vector) {
        var A = new Vector(this);
        A.sub(v);
        return A;
    }

    getMult(v: number) {
        var A = new Vector(this);
        A.mult(v);
        return A;
    }

    getDiv(v: number) {
        var A = new Vector(this);
        A.div(v);
        return A;
    }

    getLengthSq() {
        if (this.dim === 2) {
            return (this.value[0] * this.value[0] + this.value[1] * this.value[1]);
        }
        else {
            return (this.value[0] * this.value[0] + this.value[1] * this.value[1] + this.value[2] * this.value[2]);
        }
    }

    getLength() {
        return Math.sqrt(this.getLengthSq());
    }
}
