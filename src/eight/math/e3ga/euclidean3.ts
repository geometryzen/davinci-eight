function e3(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number) {
    return euclidean3({ w: w, x: x, y: y, z: z, xy: xy, yz: yz, zx: zx, xyz: xyz });
}
var euclidean3 = function(self: { w?: number; x?: number; y?: number; z?: number; xy?: number; yz?: number; zx?: number; xyz?: number }= { w: 0, x: 0, y: 0, z: 0, xy: 0, yz: 0, zx: 0, xyz: 0 }) {
    if (typeof self.w === "undefined") self.w = 0;
    if (typeof self.x === "undefined") self.x = 0;
    if (typeof self.y === "undefined") self.y = 0;
    if (typeof self.z === "undefined") self.z = 0;
    if (typeof self.xy === "undefined") self.xy = 0;
    if (typeof self.yz === "undefined") self.yz = 0;
    if (typeof self.zx === "undefined") self.zx = 0;
    if (typeof self.xyz === "undefined") self.xyz = 0;
    var that = {
        get w() { return self.w; },
        get x() { return self.x; },
        get y() { return self.y; },
        get z() { return self.z; },
        get xy() { return self.xy; },
        get yz() { return self.yz; },
        get zx() { return self.zx; },
        get xyz() { return self.xyz; },
        sub(other) {
            var w = self.w - other.w;
            var x = self.x - other.x;
            var y = self.y - other.y;
            var z = self.z - other.z;
            var xy = self.xy - other.xy;
            var yz = self.yz - other.yz;
            var zx = self.zx - other.zx;
            var xyz = self.xyz - other.xyz;
            return e3(w, x, y, z, xy, yz, zx, xyz);
        },
        mul(other) {
            // For the time being, just implement scalar multiplication.
            var w = self.w * other.w;
            var x = self.x * other.w;
            var y = self.y * other.w;
            var z = self.z * other.w;
            var xy = self.xy * other.w;
            var yz = self.yz * other.w;
            var zx = self.zx * other.w;
            var xyz = self.xyz * other.w;
            return e3(w, x, y, z, xy, yz, zx, xyz);
        },
        div(other) {
            // For the time being, just implement scalar division.
            var w = 0;
            var x = self.x / other.w;
            var y = self.y / other.w;
            var z = self.z / other.w;
            var xy = 0;
            var yz = 0;
            var zx = 0;
            var xyz = 0;
            return e3(w, x, y, z, xy, yz, zx, xyz);
        },
        cross(other) {
            // For the time being, just implement the grade-1 components.
            var w = 0;
            var x = self.y * other.z - self.z * other.y;
            var y = self.z * other.x - self.x * other.z;
            var z = self.x * other.y - self.y * other.x;
            var xy = 0;
            var yz = 0;
            var zx = 0;
            var xyz = 0;
            return e3(w, x, y, z, xy, yz, zx, xyz);
        },
        norm() {
            var x = self.x;
            var y = self.y;
            var z = self.z;
            return e3(Math.sqrt(x * x + y * y + z * z), 0, 0, 0, 0, 0, 0, 0);
        }
    };
    return that;
};

export = euclidean3;