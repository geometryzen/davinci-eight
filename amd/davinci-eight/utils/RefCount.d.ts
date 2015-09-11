import IUnknown = require('../core/IUnknown');
declare class RefCount implements IUnknown {
    private _refCount;
    private _callback;
    constructor(callback: () => void);
    addRef(): number;
    release(): number;
}
export = RefCount;
