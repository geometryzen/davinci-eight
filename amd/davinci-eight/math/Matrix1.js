var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix'], function (require, exports, AbstractMatrix) {
    var Matrix1 = (function (_super) {
        __extends(Matrix1, _super);
        /**
         * Constructs a Matrix1 by wrapping a Float32Array.
         * @constructor
         */
        function Matrix1(data) {
            _super.call(this, data, 1);
        }
        Matrix1.identity = function () {
            return new Matrix1(new Float32Array([1]));
        };
        Matrix1.prototype.add = function (element) {
            return this;
        };
        Matrix1.prototype.sum = function (a, b) {
            return this;
        };
        Matrix1.prototype.clone = function () {
            return Matrix1.identity().copy(this);
        };
        Matrix1.prototype.copy = function (m) {
            this.data.set(m.data);
            return this;
        };
        Matrix1.prototype.determinant = function () {
            return this.data[0];
        };
        Matrix1.prototype.divideScalar = function (scalar) {
            var data = this.data;
            data[0] /= scalar;
            return this;
        };
        Matrix1.prototype.exp = function () {
            return this;
        };
        Matrix1.prototype.identity = function () {
            this.data[0] = 1;
            return this;
        };
        Matrix1.prototype.lerp = function (target, alpha) {
            return this;
        };
        Matrix1.prototype.magnitude = function () {
            return Math.abs(this.data[0]);
        };
        Matrix1.prototype.multiply = function (rhs) {
            return this.product(this, rhs);
        };
        Matrix1.prototype.multiplyScalar = function (scalar) {
            var data = this.data;
            data[0] *= scalar;
            return this;
        };
        Matrix1.prototype.product = function (a, b) {
            return this;
        };
        Matrix1.prototype.quaditude = function () {
            var x = this.data[0];
            return x * x;
        };
        Matrix1.prototype.rotate = function (rotor) {
            return this;
        };
        Matrix1.prototype.sub = function (element) {
            return this;
        };
        Matrix1.prototype.difference = function (a, b) {
            return this;
        };
        return Matrix1;
    })(AbstractMatrix);
    return Matrix1;
});
