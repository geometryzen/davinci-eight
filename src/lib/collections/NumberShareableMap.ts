import { Shareable } from '../core/Shareable';
import { ShareableBase } from '../core/ShareableBase';

export class NumberShareableMap<V extends Shareable> extends ShareableBase {

    private _elements: { [key: number]: V } = {};

    constructor() {
        super();
        this.setLoggingName('NumberShareableMap');
    }

    protected destructor(levelUp: number): void {
        this.forEach(function (key, value) {
            if (value) {
                value.release();
            }
        });
        this._elements = void 0;
        super.destructor(levelUp + 1);
    }

    exists(key: number): boolean {
        let element = this._elements[key];
        return element ? true : false;
    }

    get(key: number): V {
        let element = this.getWeakRef(key);
        if (element) {
            element.addRef();
        }
        return element;
    }

    getWeakRef(index: number): V {
        return this._elements[index];
    }

    put(key: number, value: V): void {
        if (value) {
            value.addRef();
        }
        this.putWeakRef(key, value);
    }

    putWeakRef(key: number, value: V): void {
        var elements = this._elements;
        var existing = elements[key];
        if (existing) {
            existing.release();
        }
        elements[key] = value;
    }

    forEach(callback: (key: number, value: V) => void) {
        let keys: number[] = this.keys;
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            let key: number = keys[i];
            let value = this._elements[key];
            callback(key, value);
        }
    }

    get keys(): number[] {
        // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
        return Object.keys(this._elements).map(function (keyString) { return parseFloat(keyString); });
    }

    remove(key: number): void {
        // Strong or Weak doesn't matter because the value is `undefined`.
        this.put(key, void 0);
        delete this._elements[key];
    }
}
