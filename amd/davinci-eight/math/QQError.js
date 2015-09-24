var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var QQError = (function (_super) {
        __extends(QQError, _super);
        function QQError(message) {
            _super.call(this, message);
            this.name = 'QQError';
        }
        return QQError;
    })(Error);
    return QQError;
});
