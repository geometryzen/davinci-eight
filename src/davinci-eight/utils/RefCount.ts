import expectArg = require('../checks/expectArg');
import IUnknown = require('../core/IUnknown');

class RefCount implements IUnknown {
  private _refCount: number = 1;
  private _callback: () => void;
  constructor(callback: () => void) {
    expectArg('callback', callback).toBeFunction();
    this._callback = callback;
  }
  addRef(): number {
    this._refCount++;
    return this._refCount;
  }
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

export = RefCount;