var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var Euclidean3Error = (function (_super) {
        __extends(Euclidean3Error, _super);
        function Euclidean3Error(message) {
            _super.call(this, message);
            this.name = 'Euclidean3Error';
        }
        return Euclidean3Error;
    })(Error);
    return Euclidean3Error;
});
