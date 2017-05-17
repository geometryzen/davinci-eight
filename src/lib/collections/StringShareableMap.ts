import { Shareable } from '../core/Shareable';
import { ShareableBase } from '../core/ShareableBase';

/**
 *
 */
export class StringShareableMap<V extends Shareable> extends ShareableBase implements Shareable {

    private elements: { [key: string]: V } = {};

    /**
     * A map of string to V extends Shareable.
     */
    constructor() {
        super();
        this.setLoggingName('StringShareableMap');
    }

    protected destructor(levelUp: number): void {
        this.forEach((key: string) => {
            this.putWeakRef(key, void 0);
        });
        super.destructor(levelUp + 1);
    }

    /**
     * Determines whether the key exists in the map with a defined value.
     */
    public exists(key: string): boolean {
        const element = this.elements[key];
        return element ? true : false;
    }

    public get(key: string): V {
        const element = this.elements[key];
        if (element) {
            if (element.addRef) {
                element.addRef();
            }
            return element;
        }
        else {
            return void 0;
        }
    }

    public getWeakRef(key: string): V {
        return this.elements[key];
    }

    public put(key: string, value: V): void {
        if (value && value.addRef) {
            value.addRef();
        }
        this.putWeakRef(key, value);
    }

    public putWeakRef(key: string, value: V): void {
        const elements = this.elements;
        const existing = elements[key];
        if (existing) {
            if (existing.release) {
                existing.release();
            }
        }
        elements[key] = value;
    }

    public forEach(callback: (key: string, value: V) => void): void {
        const keys: string[] = this.keys;
        for (let i = 0, iLength = keys.length; i < iLength; i++) {
            const key: string = keys[i];
            callback(key, this.elements[key]);
        }
    }

    get keys(): string[] {
        return Object.keys(this.elements);
    }

    get values(): V[] {
        const values: V[] = [];
        const keys: string[] = this.keys;
        for (let i = 0, iLength = keys.length; i < iLength; i++) {
            const key: string = keys[i];
            values.push(this.elements[key]);
        }
        return values;
    }

    public remove(key: string): V {
        const value = this.elements[key];
        delete this.elements[key];
        return value;
    }
}
