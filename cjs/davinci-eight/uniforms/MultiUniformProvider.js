var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
function isDefined(value) { return value !== void 0; }
var MultiUniformProvider = (function (_super) {
    __extends(MultiUniformProvider, _super);
    function MultiUniformProvider(providers) {
        _super.call(this);
        this.providers = [];
        this.providers = providers;
    }
    MultiUniformProvider.prototype.getUniformFloat = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformFloat(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformFloat.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformMatrix2 = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformMatrix2(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformMatrix2.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformMatrix3 = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformMatrix3(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformMatrix3.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformMatrix4 = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformMatrix4(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformMatrix4.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformVector2 = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformVector2(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformVector2.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformVector3 = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformVector3(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformVector3.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformVector4 = function (name) {
        var values = this.providers.map(function (provider) { return provider.getUniformVector4(name); }).filter(isDefined);
        if (values.length === 1) {
            return values[0];
        }
        else {
            return _super.prototype.getUniformVector4.call(this, name);
        }
    };
    MultiUniformProvider.prototype.getUniformMeta = function () {
        var uniforms = _super.prototype.getUniformMeta.call(this);
        this.providers.forEach(function (provider) {
            var metas = provider.getUniformMeta();
            for (var id in metas) {
                uniforms[id] = metas[id];
            }
        });
        return uniforms;
    };
    return MultiUniformProvider;
})(DefaultUniformProvider);
module.exports = MultiUniformProvider;
