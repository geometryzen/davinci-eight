import IUnknown = require('../core/IUnknown')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')

/**
 * @class StringIUnknownMap
 * @extends Shareable
 */
class StringIUnknownMap<V extends IUnknown> extends Shareable implements IUnknown {
    /**
     * @property elements
     * @type {{[key: string]: V}}
     */
    private elements: { [key: string]: V } = {};
    /**
     * <p>
     * A map of <code>string</code> to <code>V extends IUnknown</code>.
     * </p>
     * @class StringIUnknownMap
     * @constructor
     */
    constructor() {
        super('StringIUnknownMap')
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        let self = this;
        this.forEach(function(key: string) {
            self.putWeakRef(key, void 0)
        })
        super.destructor()
    }
    /**
     * Determines whether the key exists in the map with a defined value.
     * @method exists
     * @param key {string}
     * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
     */
    public exists(key: string): boolean {
        let element = this.elements[key];
        return element ? true : false;
    }
    /**
     * @method get
     * @param key {string}
     * @return {V}
     */
    public get(key: string): V {
        let element = this.elements[key];
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
        mustBeString('key', key)
        var elements = this.elements
        var existing = elements[key]
        if (existing) {
            existing.release()
        }
        elements[key] = value
    }
    /**
     * @method forEach
     * @param callback {(key: string, value: V) => void}
     */
    public forEach(callback: (key: string, value: V) => void): void {
        let keys: string[] = this.keys;
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
        var values: V[] = []
        var keys: string[] = this.keys
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
        mustBeString('key', key)
        var value = this.elements[key]
        delete this.elements[key]
        return value
    }
}

export = StringIUnknownMap;
