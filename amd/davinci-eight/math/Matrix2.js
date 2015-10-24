var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/AbstractMatrix'], function (require, exports, AbstractMatrix) {
    /**
     * @class Matrix2
     * @extends AbstractMatrix
     */
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
        /**
         * 2x2 (square) matrix of numbers.
         * Constructs a Matrix2 by wrapping a Float32Array.
         * @class Matrix2
         * @constructor
         */
        function Matrix2(data) {
            _super.call(this, data, 2);
        }
        /**
         * <p>
         * Creates a new matrix with all elements zero except those along the main diagonal which have the value unity.
         * </p>
         * @method identity
         * @return {Matrix2}
         * @static
         */
        Matrix2.identity = function () {
            return new Matrix2(new Float32Array([1, 0, 0, 1]));
        };
        /**
         * <p>
         * Creates a new matrix with all elements zero.
         * </p>
         * @method zero
         * @return {Matrix2}
         * @static
         */
        Matrix2.zero = function () {
            return new Matrix2(new Float32Array([0, 0, 0, 0]));
        };
        Matrix2.prototype.determinant = function () {
            return 1;
        };
        Matrix2.prototype.identity = function () {
            return this;
        };
        Matrix2.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Matrix2.prototype.mul2 = function (a, b) {
            return this;
        };
        return Matrix2;
    })(AbstractMatrix);
    return Matrix2;
});
