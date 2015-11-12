define(["require", "exports", '../checks/mustBeNumber', '../i18n/readOnly'], function (require, exports, mustBeNumber, readOnly) {
    var zero;
    var e1;
    var e2;
    var e3;
    /**
     * @class CartesianE3
     */
    var CartesianE3 = (function () {
        /**
         * A lightweight immutable type representing Cartesian coordinates (in Euclidean space).
         * @class CartesianE3
         * @constructor
         * @param x {number} The <em>x coordinate</em>.
         * @param y {number} The <em>y coordinate</em>.
         * @param z {number} The <em>z coordinate</em>.
         */
        function CartesianE3(x, y, z, areYouSure) {
            mustBeNumber('x', x);
            mustBeNumber('y', y);
            mustBeNumber('z', z);
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
                throw new Error(readOnly('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "y", {
            get: function () {
                return this.coordinates[1];
            },
            set: function (unused) {
                throw new Error(readOnly('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "z", {
            get: function () {
                return this.coordinates[2];
            },
            set: function (unused) {
                throw new Error(readOnly('z').message);
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
        Object.defineProperty(CartesianE3, "zero", {
            /**
             * @property zero
             * @type {CartesianE3}
             * @static
             */
            get: function () { return zero; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3, "e1", {
            /**
             * @property e1
             * @type {CartesianE3}
             * @static
             */
            get: function () { return e1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3, "e2", {
            /**
             * @property e2
             * @type {CartesianE3}
             * @static
             */
            get: function () { return e2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CartesianE3, "e3", {
            /**
             * @property e3
             * @type {CartesianE3}
             * @static
             */
            get: function () { return e3; },
            enumerable: true,
            configurable: true
        });
        /**
         * @method fromVectorE3
         * @param vector {VectorE3}
         * @return {CartesianE3}
         * @static
         */
        CartesianE3.fromVectorE3 = function (vector) {
            return new CartesianE3(vector.x, vector.y, vector.z, true);
        };
        /**
         * @method direction
         * @param vector {VectorE3}
         * @return {CartesianE3}
         * @static
         */
        CartesianE3.direction = function (vector) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            var m = Math.sqrt(x * x + y * y + z * z);
            return new CartesianE3(x / m, y / m, z / m, true);
        };
        return CartesianE3;
    })();
    zero = new CartesianE3(0, 0, 0, true);
    e1 = new CartesianE3(1, 0, 0, true);
    e2 = new CartesianE3(0, 1, 0, true);
    e3 = new CartesianE3(0, 0, 1, true);
    return CartesianE3;
});
