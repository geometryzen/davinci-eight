var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var Euclidean1Error = (function (_super) {
        __extends(Euclidean1Error, _super);
        function Euclidean1Error(message) {
            _super.call(this, message);
            this.name = 'Euclidean1Error';
        }
        return Euclidean1Error;
    })(Error);
    return Euclidean1Error;
});
