define(["require", "exports", '../checks/mustBeNumber', '../i18n/readOnly'], function (require, exports, mustBeNumber_1, readOnly_1) {
    var CartesianE3 = (function () {
        function CartesianE3(x, y, z, areYouSure) {
            mustBeNumber_1.default('x', x);
            mustBeNumber_1.default('y', y);
            mustBeNumber_1.default('z', z);
            this.coordinates = [x, y, z];
            if (!areYouSure) {
                console.warn("Try constructing CartesianE3 from geometric static methods.");
            }
        }
        Object.defineProperty(CartesianE3.prototype, "x", {
            get: function () {
                return this.coordinates[0];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "y", {
            get: function () {
                return this.coordinates[1];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "z", {
            get: function () {
                return this.coordinates[2];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('z').message);
            },
            enumerable: true,
            configurable: true
        });
        CartesianE3.prototype.magnitude = function () {
            return Math.sqrt(this.squaredNorm());
        };
        CartesianE3.prototype.squaredNorm = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return x * x + y * y + z * z;
        };
        CartesianE3.fromVectorE3 = function (vector) {
            return new CartesianE3(vector.x, vector.y, vector.z, true);
        };
        CartesianE3.direction = function (vector) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            var m = Math.sqrt(x * x + y * y + z * z);
            return new CartesianE3(x / m, y / m, z / m, true);
        };
        return CartesianE3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CartesianE3;
});
