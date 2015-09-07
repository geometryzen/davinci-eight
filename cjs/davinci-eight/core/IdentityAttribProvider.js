var IdentityAttribProvider = (function () {
    function IdentityAttribProvider() {
        this._refCount = 1;
    }
    IdentityAttribProvider.prototype.draw = function () {
    };
    IdentityAttribProvider.prototype.update = function () {
    };
    IdentityAttribProvider.prototype.getAttribData = function () {
        var attributes = {};
        return attributes;
    };
    IdentityAttribProvider.prototype.getAttribMeta = function () {
        var attributes = {};
        return attributes;
    };
    IdentityAttribProvider.prototype.addRef = function () {
        this._refCount++;
        return this._refCount;
    };
    IdentityAttribProvider.prototype.release = function () {
        this._refCount--;
        if (this._refCount === 0) {
        }
        return this._refCount;
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
    return IdentityAttribProvider;
})();
module.exports = IdentityAttribProvider;
