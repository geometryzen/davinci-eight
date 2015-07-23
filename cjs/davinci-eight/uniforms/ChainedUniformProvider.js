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
    ChainedUniformProvider.prototype.getUniformVector2 = function (name) {
        var v2 = this.provider.getUniformVector2(name);
        if (v2) {
            return v2;
        }
        else {
            return this.fallback.getUniformVector3(name);
        }
    };
    ChainedUniformProvider.prototype.getUniformVector3 = function (name) {
        var v3 = this.provider.getUniformVector3(name);
        if (v3) {
            return v3;
        }
        else {
            return this.fallback.getUniformVector3(name);
        }
    };
    ChainedUniformProvider.prototype.getUniformVector4 = function (name) {
        var v4 = this.provider.getUniformVector4(name);
        if (v4) {
            return v4;
        }
        else {
            return this.fallback.getUniformVector4(name);
        }
    };
    ChainedUniformProvider.prototype.getUniformMetaInfos = function () {
        var uniforms = {};
        var ones = this.provider.getUniformMetaInfos();
        for (name in ones) {
            uniforms[name] = ones[name];
        }
        var twos = this.fallback.getUniformMetaInfos();
        for (name in twos) {
            uniforms[name] = twos[name];
        }
        return uniforms;
    };
    return ChainedUniformProvider;
})();
module.exports = ChainedUniformProvider;
