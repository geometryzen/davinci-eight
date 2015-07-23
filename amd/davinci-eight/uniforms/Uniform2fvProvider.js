var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../uniforms/DefaultUniformProvider', '../utils/uuid4'], function (require, exports, DefaultUniformProvider, uuid4) {
    var Uniform2fvProvider = (function (_super) {
        __extends(Uniform2fvProvider, _super);
        function Uniform2fvProvider(name, data, glslType, canonicalName) {
            if (glslType === void 0) { glslType = 'vec2'; }
            _super.call(this);
            this.name = name;
            this.data = data;
            this.glslType = glslType;
            this.canonicalName = typeof canonicalName !== 'undefined' ? canonicalName : uuid4().generate();
        }
        Uniform2fvProvider.prototype.getUniformVector2 = function (name) {
            switch (name) {
                case this.name: {
                    return this.data();
                }
                default: {
                    return _super.prototype.getUniformVector2.call(this, name);
                }
            }
            return this.data();
        };
        Uniform2fvProvider.prototype.getUniformMetaInfos = function () {
            var uniforms = _super.prototype.getUniformMetaInfos.call(this);
            uniforms[this.canonicalName] = { name: this.name, glslType: this.glslType };
            return uniforms;
        };
        return Uniform2fvProvider;
    })(DefaultUniformProvider);
    return Uniform2fvProvider;
});
