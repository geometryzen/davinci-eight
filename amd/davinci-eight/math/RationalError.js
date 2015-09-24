var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var RationalError = (function (_super) {
        __extends(RationalError, _super);
        function RationalError(message) {
            _super.call(this, message);
            this.name = 'RationalError';
        }
        return RationalError;
    })(Error);
    return RationalError;
});
