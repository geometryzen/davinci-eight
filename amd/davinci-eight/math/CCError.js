var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var CCError = (function (_super) {
        __extends(CCError, _super);
        function CCError(message) {
            _super.call(this, message);
            this.name = 'CCError';
        }
        return CCError;
    })(Error);
    return CCError;
});
