/**
 * @class UniformDataInfo
 */
interface UniformDataInfo {
    transpose?: boolean;
    x?: number;
    y?: number;
    z?: number;
    w?: number;
    vector?: number[];
    matrix2?: Float32Array;
    matrix3?: Float32Array;
    matrix4?: Float32Array;
    uniformZs?: Int32Array;
}
export = UniformDataInfo;
