import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import isUndefined = require('../checks/isUndefined');
import LinearElement = require('../math/LinearElement');

function constructorString(T: string): string {
  return "new VectorN<" + T + ">(data: " + T + "[], modified: boolean = false, size?: number)";
}

function pushString(T: string): string {
  return "push(value: " + T + "): number";
}

function popString(T: string): string {
  return "pop(): " + T;
}

function contextNameKind(context: string, name: string, kind: string): string {
  return name + " must be a " + kind + " in " + context;
}

function contextNameLength(context: string, name: string, length: number): string {
  return name + " length must be " + length + " in " + context;
}

function ctorDataKind(): string {
  return contextNameKind(constructorString('T'), 'data', 'T[]');
}

function ctorDataLength(length: number): () => string {
  return function(): string {
    return contextNameLength(constructorString('T'), 'data', length);
  }
}

function verboten(operation: string): string {
  return operation + " is not allowed for a fixed size vector";
}

function verbotenPush(): string {
  return verboten(pushString('T'));
}

function verbotenPop(): string {
  return verboten(popString('T'));
}

function ctorModifiedKind(): string {
  return contextNameKind(constructorString('T'), 'modified', 'boolean');
}

function ctorSizeKind(): string {
  return contextNameKind(constructorString('T'), 'size', 'number');
}

/**
 * @class VectorN<T>
 * @extends Mutable<T[]>
 */
class VectorN<T> implements Mutable<T[]> {
  private _size: number;
  private _data: T[];
  private _callback: () => T[];
  public modified: boolean;
  /**
   * @class VectorN
   * @constructor
   * @param data {T[]}
   * @param modified [boolean = false]
   * @param [size]
   */
  constructor(data: T[], modified: boolean = false, size?: number) {
    let dataArg = expectArg('data', data).toBeObject(ctorDataKind);
    this.modified = expectArg('modified', modified).toBeBoolean(ctorModifiedKind).value;
    if (isDefined(size)) {
      this._size = expectArg('size', size).toBeNumber(ctorSizeKind).toSatisfy(size >= 0, "size must be positive").value;
      this._data = dataArg.toSatisfy(data.length === size, ctorDataLength(size)()).value;
    }
    else {
      this._size = void 0;
      this._data = dataArg.value;
    }
  }
  get data() {
    if (this._data) {
      return this._data;
    }
    else if (this._callback) {
      var data = this._callback();
      if (isDefined(this._size)) {
        expectArg('callback()', data).toSatisfy(data.length === this._size, "callback() length must be " + this._size);
      }
      return this._callback();
    }
    else {
      throw new Error("Vector" + this._size + " is undefined.");
    }
  }
  set data(data: T[]) {
    if (isDefined(this._size)) {
      expectArg('data', data).toSatisfy(data.length === this._size, "data length must be " + this._size);
    }
    this._data = data;
    this._callback = void 0;
  }
  get callback() {
    return this._callback;
  }
  set callback(reactTo: () => T[]) {
    this._callback = reactTo;
    this._data = void 0;
  }
  get length() {
    return this.data.length;
  }
  clone(): VectorN<T> {
    return new VectorN<T>(this._data, this.modified, this._size);
  }
  getComponent(index: number): T {
    return this.data[index];
  }
  pop(): T {
    if (isUndefined(this._size)) {
      return this.data.pop();
    }
    else {
      throw new Error(verbotenPop());
    }
  }
  // TODO: How to prototype this as ...items: T[]
  push(value: T): number {
    if (isUndefined(this._size)) {
      let data = this.data;
      let newLength = data.push(value);
      this.data = data;
      return newLength;
    }
    else {
      throw new Error(verbotenPush());
    }
  }
  setComponent(index: number, value: T): void {
    let data: T[] = this.data;
    let existing = data[index];
    if (value !== existing) {
      data[index] = value;
      this.data = data;
      this.modified = true;
    }
  }
  toArray(array: T[] = [], offset: number = 0): T[] {
    let data = this.data;
    let length = data.length;
    for (var i = 0; i < length; i++) {
      array[offset + i] = data[i];
    }
    return array;
  }
  toLocaleString(): string {
    return this.data.toLocaleString();
  }
  toString(): string {
    return this.data.toString();
  }
}

export = VectorN;