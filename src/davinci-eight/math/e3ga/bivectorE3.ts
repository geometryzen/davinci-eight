//
// bivectorE3.ts
//
/// <reference path="../../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />

var bivectorE3 = function(xy: number, yz: number, zx: number): Euclidean3 {
    return new Euclidean3(0, 0, 0, 0, xy, yz, zx, 0);
};
export = bivectorE3;
