var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
        return Matrix1;
    })(AbstractMatrix);
    return Matrix1;
});
