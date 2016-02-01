var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var UnitError = (function (_super) {
        __extends(UnitError, _super);
        function UnitError(message) {
            _super.call(this, message);
            this.name = 'UnitError';
        }
        return UnitError;
    })(Error);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UnitError;
});
