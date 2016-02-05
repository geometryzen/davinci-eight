import IUnknown from '../core/IUnknown';
import mustBeFunction from '../checks/mustBeFunction';

/**
 * @class RefCount
 */
export default class RefCount implements IUnknown {
    private _refCount: number = 1;
    private _callback: () => void;

    /**
     * @class RefCount
     * @constructor
     * @param callback {() => void}
     */
    constructor(callback: () => void) {
        mustBeFunction('callback', callback);
        this._callback = callback;
    }

    /**
     * @method addRef
     * @return {number}
     */
    addRef(): number {
        this._refCount++;
        return this._refCount;
    }

    /**
     * @method release
     * @return {number}
     */
    release(): number {
        if (this._refCount > 0) {
            this._refCount--;
            if (this._refCount === 0) {
                let callback: () => void = this._callback;
                this._callback = void 0;
                callback();
            }
            return this._refCount;
        }
        else {
            console.warn("release() called with refCount already " + this._refCount);
        }
    }
}
