import Mutable = require('../math/Mutable');
declare class AbstractVector implements Mutable<number[]> {
    private _data;
    private _callback;
    private _size;
    modified: boolean;
    constructor(data: number[], size: number);
    data: number[];
    callback: () => number[];
}
export = AbstractVector;
