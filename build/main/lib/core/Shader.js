"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shader = void 0;
var tslib_1 = require("tslib");
var makeWebGLShader_1 = require("./makeWebGLShader");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeString_1 = require("../checks/mustBeString");
var mustBeUndefined_1 = require("../checks/mustBeUndefined");
var ShareableContextConsumer_1 = require("./ShareableContextConsumer");
/**
 *
 */
var Shader = /** @class */ (function (_super) {
    tslib_1.__extends(Shader, _super);
    function Shader(source, type, engine) {
        var _this = _super.call(this, engine) || this;
        _this.setLoggingName('Shader');
        _this._source = mustBeString_1.mustBeString('source', source);
        _this._shaderType = mustBeNumber_1.mustBeNumber('type', type);
        return _this;
    }
    Shader.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
        mustBeUndefined_1.mustBeUndefined(this.getLoggingName(), this._shader);
    };
    Shader.prototype.contextFree = function () {
        if (this._shader) {
            this.contextManager.gl.deleteShader(this._shader);
            this._shader = void 0;
        }
        _super.prototype.contextFree.call(this);
    };
    Shader.prototype.contextGain = function () {
        this._shader = makeWebGLShader_1.makeWebGLShader(this.contextManager.gl, this._source, this._shaderType);
        _super.prototype.contextGain.call(this);
    };
    Shader.prototype.contextLost = function () {
        this._shader = void 0;
        _super.prototype.contextLost.call(this);
    };
    return Shader;
}(ShareableContextConsumer_1.ShareableContextConsumer));
exports.Shader = Shader;
