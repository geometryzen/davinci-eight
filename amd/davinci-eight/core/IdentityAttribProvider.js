define(["require", "exports"], function (require, exports) {
    var IdentityAttribProvider = (function () {
        function IdentityAttribProvider() {
        }
        IdentityAttribProvider.prototype.draw = function (context) {
        };
        IdentityAttribProvider.prototype.update = function () {
        };
        IdentityAttribProvider.prototype.getAttribArray = function (name) {
            return;
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
        return IdentityAttribProvider;
    })();
    return IdentityAttribProvider;
});
