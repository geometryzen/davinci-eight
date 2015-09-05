var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../math/AbstractMatrix'], function (require, exports, AbstractMatrix) {
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
        /**
         * Constructs a Matrix2 by wrapping a Float32Array.
         * @constructor
         */
        function Matrix2(data) {
            _super.call(this, data, 4);
        }
        return Matrix2;
    })(AbstractMatrix);
    return Matrix2;
});
