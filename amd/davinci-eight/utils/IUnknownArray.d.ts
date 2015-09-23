import IUnknown = require('../core/IUnknown');
declare class IUnknownArray<T extends IUnknown> implements IUnknown {
    private _elements;
    private _refCount;
    private _uuid;
    constructor();
    addRef(): number;
    getWeakReference(index: number): T;
    getStrongReference(index: number): T;
    indexOf(element: T): number;
    length: number;
    release(): number;
    splice(index: number, count: number): T[];
    /**
     * Traverse without Reference Counting
     */
    forEach(callback: (value: T, index: number) => void): void;
    push(element: T): void;
    pop(): T;
}
export = IUnknownArray;
