define(["require", "exports"], function (require, exports) {
    /// <reference path='../renderers/VertexUniformProvider.d.ts'/>
    var ChainedVertexUniformProvider = (function () {
        function ChainedVertexUniformProvider(provider, fallback) {
            this.provider = provider;
            this.fallback = fallback;
        }
        ChainedVertexUniformProvider.prototype.getUniformMatrix3 = function (name) {
            var m3 = this.provider.getUniformMatrix3(name);
            if (m3) {
                return m3;
            }
            else {
                return this.fallback.getUniformMatrix3(name);
            }
        };
        ChainedVertexUniformProvider.prototype.getUniformMatrix4 = function (name) {
            var m4 = this.provider.getUniformMatrix4(name);
            if (m4) {
                return m4;
            }
            else {
                return this.fallback.getUniformMatrix4(name);
            }
        };
        return ChainedVertexUniformProvider;
    })();
    return ChainedVertexUniformProvider;
});
