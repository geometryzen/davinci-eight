/// <reference path="Euclidean3.d.ts" />
declare var euclidean3: (spec?: {
    w?: number;
    x?: number;
    y?: number;
    z?: number;
    xy?: number;
    yz?: number;
    zx?: number;
    xyz?: number;
}) => Euclidean3;
export = euclidean3;
