var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var NotImplementedError = (function (_super) {
        __extends(NotImplementedError, _super);
        function NotImplementedError(message) {
            _super.call(this, message);
            this.name = 'NotImplementedError';
        }
        return NotImplementedError;
    })(Error);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NotImplementedError;
});
