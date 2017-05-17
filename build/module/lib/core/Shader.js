import * as tslib_1 from "tslib";
import { makeWebGLShader } from './makeWebGLShader';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeString } from '../checks/mustBeString';
import { mustBeUndefined } from '../checks/mustBeUndefined';
import { ShareableContextConsumer } from './ShareableContextConsumer';
/**
 *
 */
var Shader = (function (_super) {
    tslib_1.__extends(Shader, _super);
    function Shader(source, type, engine) {
        var _this = _super.call(this, engine) || this;
        _this.setLoggingName('Shader');
        _this._source = mustBeString('source', source);
        _this._shaderType = mustBeNumber('type', type);
        return _this;
    }
    Shader.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
        mustBeUndefined(this.getLoggingName(), this._shader);
    };
    Shader.prototype.contextFree = function () {
        if (this._shader) {
            this.contextManager.gl.deleteShader(this._shader);
            this._shader = void 0;
        }
        _super.prototype.contextFree.call(this);
    };
    Shader.prototype.contextGain = function () {
        this._shader = makeWebGLShader(this.contextManager.gl, this._source, this._shaderType);
        _super.prototype.contextGain.call(this);
    };
    Shader.prototype.contextLost = function () {
        this._shader = void 0;
        _super.prototype.contextLost.call(this);
    };
    return Shader;
}(ShareableContextConsumer));
export { Shader };
