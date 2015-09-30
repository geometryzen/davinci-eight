define(["require", "exports", '../math/VectorN', '../math/wedgeXY', '../math/wedgeYZ', '../math/wedgeZX'], function (require, exports, VectorN, wedgeXY, wedgeYZ, wedgeZX) {
    var INDEX_YZ = 0;
    var INDEX_ZX = 1;
    var INDEX_XY = 2;
    var INDEX_W = 3;
    var INDEX_A = 0;
    var INDEX_B = 1;
    var INDEX_C = 2;
    /**
     * Functional constructor for producing a Rotor3.
     * The function is named so as to avoid case-insensitive collisions with Rotor3.
     * This will be exposed as `rotor3`.
     * We only need 2 parameters because the sum of the squares of the components is 1.
     * Perhaps we should think of the third as being part of a cache?
     * Extending this idea, what if
     */
    function rotor3() {
        // For mutable classes, perhaps no-arg constructors make sense,
        // or maybe we have specialized constructors that maintain a data structure?
        // yz <=> a <=> 0
        // zx <=> b <=> 1
        // xy <=> c <=> 2
        // We choose any kind of data structure to store our state.
        var data = new VectorN([0, 0, 0, 1], false, 4);
        var self = {
            get modified() {
                return data.modified;
            },
            set modified(value) {
                data.modified = value;
            },
            get yz() {
                return data.getComponent(INDEX_YZ);
            },
            set yz(value) {
                data.setComponent(INDEX_YZ, value);
            },
            get zx() {
                return data.getComponent(INDEX_ZX);
            },
            set zx(value) {
                data.setComponent(INDEX_ZX, value);
            },
            get xy() {
                return data.getComponent(INDEX_XY);
            },
            set xy(value) {
                data.setComponent(INDEX_XY, value);
            },
            get w() {
                return data.getComponent(INDEX_W);
            },
            set w(value) {
                data.setComponent(INDEX_W, value);
            },
            copy: function (spinor) {
                self.w = spinor.w;
                self.yz = spinor.yz;
                self.zx = spinor.zx;
                self.xy = spinor.xy;
                return self;
            },
            exp: function () {
                var w = this.w;
                var yz = this.yz;
                var zx = this.zx;
                var xy = this.xy;
                var expW = Math.exp(w);
                var B = Math.sqrt(yz * yz + zx * zx + xy * xy);
                var s = expW * (B !== 0 ? Math.sin(B) / B : 1);
                this.w = expW * Math.cos(B);
                this.yz = yz * s;
                this.zx = zx * s;
                this.xy = xy * s;
                return this;
            },
            multiply: function (spinor) {
                return self.product(self, spinor);
            },
            scale: function (s) {
                self.w *= s;
                self.yz *= s;
                self.zx *= s;
                self.xy *= s;
                return self;
            },
            product: function (n, m) {
                var n0 = n.w;
                var n1 = n.yz;
                var n2 = n.zx;
                var n3 = n.xy;
                var m0 = m.w;
                var m1 = m.yz;
                var m2 = m.zx;
                var m3 = m.xy;
                // TODO; We are assuming that the inputs are unit vectors!
                var W = n0 * m0 - n1 * m1 - n2 * m2 - n3 * m3;
                var A = n0 * m1 + n1 * m0 - n2 * m3 + n3 * m2;
                var B = n0 * m2 + n1 * m3 + n2 * m0 - n3 * m1;
                var C = n0 * m3 - n1 * m2 + n2 * m1 + n3 * m0;
                var magnitude = Math.sqrt(W * W + A * A + B * B + C * C);
                self.w = W / magnitude;
                self.yz = A / magnitude;
                self.zx = B / magnitude;
                self.xy = C / magnitude;
                return self;
            },
            reverse: function () {
                self.yz *= -1;
                self.zx *= -1;
                self.xy *= -1;
                return self;
            },
            toString: function () {
                return ['Rotor3 => ', JSON.stringify({ yz: self.yz, zx: self.zx, xy: self.xy, w: self.w })].join('');
            },
            spinor: function (a, b) {
                var ax = a.x, ay = a.y, az = a.z;
                var bx = b.x, by = b.y, bz = b.z;
                this.w = 0;
                this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
                this.zx = wedgeZX(ax, ay, az, bx, by, bz);
                this.xy = wedgeXY(ax, ay, az, bx, by, bz);
                return this;
            }
        };
        return self;
    }
    return rotor3;
});
