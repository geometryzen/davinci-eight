import {Shareable} from '../core/Shareable';
import {ShareableBase} from '../core/ShareableBase';

/**
 *
 */
export default class StringShareableMap<V extends Shareable> extends ShareableBase implements Shareable {

    /**
     * @property elements
     * @type {{[key: string]: V}}
     */
    private elements: { [key: string]: V } = {};

    /**
     * A map of <code>string</code> to <code>V extends Shareable</code>.
     */
    constructor() {
        super()
        this.setLoggingName('StringShareableMap')
    }

    protected destructor(levelUp: number): void {
        this.forEach((key: string) => {
            this.putWeakRef(key, void 0);
        })
        super.destructor(levelUp + 1);
    }

    /**
     * Determines whether the key exists in the map with a defined value.
     *
     * @method exists
     * @param key {string}
     * @return <p><code>true</code> if there is an element at the specified key.</p>
     */
    public exists(key: string): boolean {
        const element = this.elements[key];
        return element ? true : false;
    }

    /**
     * @method get
     * @param key {string}
     * @return {V}
     */
    public get(key: string): V {
        const element = this.elements[key];
        if (element) {
            element.addRef();
            return element;
        }
        else {
            return void 0;
        }
    }

    /**
     * @method getWeakRef
     * @param key {string}
     * @return {V}
     */
    public getWeakRef(key: string): V {
        return this.elements[key];
    }

    /**
     * @method put
     * @param key {string}
     * @param value {V}
     * @return {void}
     */
    public put(key: string, value: V): void {
        if (value) {
            value.addRef()
        }
        this.putWeakRef(key, value)
    }

    /**
     * @method putWeakRef
     * @param key {string}
     * @param value {V}
     * @return {void}
     */
    public putWeakRef(key: string, value: V): void {
        const elements = this.elements
        const existing = elements[key]
        if (existing) {
            existing.release()
        }
        elements[key] = value
    }

    /**
     * @method forEach
     * @param callback {(key: string, value: V) => void}
     * @return {void}
     */
    public forEach(callback: (key: string, value: V) => void): void {
        const keys: string[] = this.keys;
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            let key: string = keys[i];
            callback(key, this.elements[key]);
        }
    }

    /**
     * @property keys
     * @type {string[]}
     */
    get keys(): string[] {
        return Object.keys(this.elements);
    }

    /**
     * @property values
     * @type {V[]}
     */
    get values(): V[] {
        const values: V[] = []
        const keys: string[] = this.keys
        for (var i = 0, iLength = keys.length; i < iLength; i++) {
            let key: string = keys[i]
            values.push(this.elements[key])
        }
        return values
    }

    /**
     * @method remove
     * @param key {string}
     * @return {V}
     */
    public remove(key: string): V {
        const value = this.elements[key]
        delete this.elements[key]
        return value
    }
}
