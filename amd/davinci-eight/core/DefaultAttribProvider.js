var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/IdentityAttribProvider', '../core/Symbolic'], function (require, exports, IdentityAttribProvider, Symbolic) {
    var DefaultAttribProvider = (function (_super) {
        __extends(DefaultAttribProvider, _super);
        function DefaultAttribProvider() {
            _super.call(this);
        }
        DefaultAttribProvider.prototype.draw = function () {
        };
        DefaultAttribProvider.prototype.update = function () {
            return _super.prototype.update.call(this);
        };
        DefaultAttribProvider.prototype.getAttribArray = function (name) {
            return _super.prototype.getAttribArray.call(this, name);
        };
        DefaultAttribProvider.prototype.getAttribMeta = function () {
            var attributes = _super.prototype.getAttribMeta.call(this);
            attributes[Symbolic.ATTRIBUTE_POSITION] = { glslType: 'vec3', size: 3 };
            return attributes;
        };
        DefaultAttribProvider.prototype.hasElementArray = function () {
            return _super.prototype.hasElementArray.call(this);
        };
        DefaultAttribProvider.prototype.getElementArray = function () {
            return _super.prototype.getElementArray.call(this);
        };
        return DefaultAttribProvider;
    })(IdentityAttribProvider);
    return DefaultAttribProvider;
});
