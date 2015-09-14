var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMatrix = require('../math/AbstractMatrix');
var Matrix2 = (function (_super) {
    __extends(Matrix2, _super);
    /**
     * Constructs a Matrix2 by wrapping a Float32Array.
     * @constructor
     */
    function Matrix2(data) {
        _super.call(this, data, 4);
    }
    Matrix2.prototype.determinant = function () {
        return 1;
    };
    Matrix2.prototype.identity = function () {
        return this;
    };
    Matrix2.prototype.multiply = function (rhs) {
        return this.product(this, rhs);
    };
    Matrix2.prototype.product = function (a, b) {
        return this;
    };
    return Matrix2;
})(AbstractMatrix);
module.exports = Matrix2;
