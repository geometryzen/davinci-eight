/// <reference path='../renderers/UniformProvider.d.ts'/>
var ChainedUniformProvider = (function () {
    function ChainedUniformProvider(provider, fallback) {
        this.provider = provider;
        this.fallback = fallback;
    }
    ChainedUniformProvider.prototype.getUniformMatrix3 = function (name) {
        var m3 = this.provider.getUniformMatrix3(name);
        if (m3) {
            return m3;
        }
        else {
            return this.fallback.getUniformMatrix3(name);
        }
    };
    ChainedUniformProvider.prototype.getUniformMatrix4 = function (name) {
        var m4 = this.provider.getUniformMatrix4(name);
        if (m4) {
            return m4;
        }
        else {
            return this.fallback.getUniformMatrix4(name);
        }
    };
    return ChainedUniformProvider;
})();
module.exports = ChainedUniformProvider;
