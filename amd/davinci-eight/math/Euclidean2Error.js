var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var Euclidean2Error = (function (_super) {
        __extends(Euclidean2Error, _super);
        function Euclidean2Error(message) {
            _super.call(this, message);
            this.name = 'Euclidean2Error';
        }
        return Euclidean2Error;
    })(Error);
    return Euclidean2Error;
});
