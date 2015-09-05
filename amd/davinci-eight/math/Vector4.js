var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../math/AbstractVector'], function (require, exports, AbstractVector) {
    /**
     * @class Vector4
     */
    var Vector4 = (function (_super) {
        __extends(Vector4, _super);
        /**
         * @class Vector4
         * @constructor
         * @param data {number[]}
         */
        function Vector4(data) {
            if (data === void 0) { data = [0, 0, 0, 0]; }
            _super.call(this, data, 4);
        }
        Object.defineProperty(Vector4.prototype, "x", {
            /**
             * @property x
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.x !== value;
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "y", {
            /**
             * @property y
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.y !== value;
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "z", {
            /**
             * @property z
             * @type Number
             */
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.modified = this.modified || this.z !== value;
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "w", {
            /**
             * @property w
             * @type Number
             */
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.modified = this.modified || this.w !== value;
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        return Vector4;
    })(AbstractVector);
    return Vector4;
});
