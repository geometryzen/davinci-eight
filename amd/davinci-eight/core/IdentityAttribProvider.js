define(["require", "exports"], function (require, exports) {
    var IdentityAttribProvider = (function () {
        function IdentityAttribProvider() {
        }
        IdentityAttribProvider.prototype.draw = function () {
        };
        IdentityAttribProvider.prototype.update = function () {
        };
        IdentityAttribProvider.prototype.getAttribArray = function (name) {
            return;
        };
        IdentityAttribProvider.prototype.getAttribData = function () {
            var attributes = {};
            return attributes;
        };
        IdentityAttribProvider.prototype.getAttribMeta = function () {
            var attributes = {};
            return attributes;
        };
        IdentityAttribProvider.prototype.hasElementArray = function () {
            return false;
        };
        IdentityAttribProvider.prototype.getElementArray = function () {
            return;
        };
        IdentityAttribProvider.prototype.addRef = function () {
        };
        IdentityAttribProvider.prototype.release = function () {
        };
        IdentityAttribProvider.prototype.contextFree = function () {
            this._context = void 0;
        };
        IdentityAttribProvider.prototype.contextGain = function (context) {
            this._context = context;
        };
        IdentityAttribProvider.prototype.contextLoss = function () {
            this._context = void 0;
        };
        IdentityAttribProvider.prototype.hasContext = function () {
            return !!this._context;
        };
        return IdentityAttribProvider;
    })();
    return IdentityAttribProvider;
});
