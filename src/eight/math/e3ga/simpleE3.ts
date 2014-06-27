import Euclidean3 = require('eight/math/e3ga/Euclidean3');

var f = function(self: { w?: number; x?: number; y?: number; z?: number; xy?: number; yz?: number; zx?: number; xyz?: number }= { w: 0, x: 0, y: 0, z: 0, xy: 0, yz: 0, zx: 0, xyz: 0 }) {
    if (typeof self.w === "undefined") self.w = 0;
    if (typeof self.x === "undefined") self.x = 0;
    if (typeof self.y === "undefined") self.y = 0;
    if (typeof self.z === "undefined") self.z = 0;
    if (typeof self.xy === "undefined") self.xy = 0;
    if (typeof self.yz === "undefined") self.yz = 0;
    if (typeof self.zx === "undefined") self.zx = 0;
    if (typeof self.xyz === "undefined") self.xyz = 0;
    return new Euclidean3(self.w, self.x, self.y, self.z, self.xy, self.yz, self.zx, self.xyz);
};
export = f;