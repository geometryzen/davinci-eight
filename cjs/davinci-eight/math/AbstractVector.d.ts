import Mutable = require('../math/Mutable');
declare class AbstractVector implements Mutable<number[]> {
    private _size;
    private _data;
    private _callback;
    modified: boolean;
    constructor(data: number[], size: number, modified?: boolean);
    data: number[];
    callback: () => number[];
}
export = AbstractVector;
