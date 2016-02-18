define(["require", "exports", '../core', '../checks/mustBeNumber', '../i18n/readOnly'], function (require, exports, core_1, mustBeNumber_1, readOnly_1) {
    var CartesianE3 = (function () {
        function CartesianE3(x, y, z, uom) {
            if (core_1.default.safemode) {
                mustBeNumber_1.default('x', x);
                mustBeNumber_1.default('y', y);
                mustBeNumber_1.default('z', z);
            }
            this._coords = [x, y, z];
            this._uom = uom;
        }
        Object.defineProperty(CartesianE3.prototype, "x", {
            get: function () {
                return this._coords[0];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "y", {
            get: function () {
                return this._coords[1];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "z", {
            get: function () {
                return this._coords[2];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('z').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "uom", {
            get: function () {
                return this._uom;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uom').message);
            },
            enumerable: true,
            configurable: true
        });
        CartesianE3.prototype.magnitude = function () {
            return Math.sqrt(this.squaredNorm());
        };
        CartesianE3.prototype.neg = function () {
            return this.scale(-1);
        };
        CartesianE3.prototype.scale = function (α) {
            return new CartesianE3(α * this.x, α * this.y, α * this.z, this.uom);
        };
        CartesianE3.prototype.squaredNorm = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return x * x + y * y + z * z;
        };
        CartesianE3.fromVectorE3 = function (vector) {
            return new CartesianE3(vector.x, vector.y, vector.z, vector.uom);
        };
        CartesianE3.direction = function (vector) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            var m = Math.sqrt(x * x + y * y + z * z);
            return new CartesianE3(x / m, y / m, z / m, void 0);
        };
        CartesianE3.zero = new CartesianE3(0, 0, 0, void 0);
        CartesianE3.e1 = new CartesianE3(1, 0, 0, void 0);
        CartesianE3.e2 = new CartesianE3(0, 1, 0, void 0);
        CartesianE3.e3 = new CartesianE3(0, 0, 1, void 0);
        return CartesianE3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CartesianE3;
});
