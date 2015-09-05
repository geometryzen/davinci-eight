import Mutable = require('../math/Mutable');
declare class AbstractMatrix implements Mutable<Float32Array> {
    private _data;
    private _callback;
    private _length;
    modified: boolean;
    constructor(data: Float32Array, length: number);
    data: Float32Array;
    callback: () => Float32Array;
}
export = AbstractMatrix;
