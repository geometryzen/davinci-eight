var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var DimensionError = (function (_super) {
        __extends(DimensionError, _super);
        function DimensionError(message) {
            _super.call(this, message);
            this.name = 'DimensionError';
        }
        return DimensionError;
    })(Error);
    return DimensionError;
});
