import { R3 } from '../math/R3';
export interface ALR {
    axis: Readonly<R3>;
    length: number;
    meridian: Readonly<R3>;
    radius: number;
    sliceAngle: number;
}
export declare const ds: ALR;
