import { __extends } from "tslib";
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { fragmentShaderSrc as fShaderSrc } from './fragmentShaderSrc';
import { glslVersionFromWebGLContextId } from './glslVersionFromWebGLContextId';
import { ShaderMaterial } from './ShaderMaterial';
import { vertexShaderSrc as vShaderSrc } from './vertexShaderSrc';
function getContextId(contextManager) {
    return mustBeNonNullObject('contextManager', contextManager).contextId;
}
/**
 * A Material that is generated based upon knowledge of parameters and some hints.
 * This is currently not exposed and has limited testing.
 * @hidden
 */
var SmartGraphicsProgram = /** @class */ (function (_super) {
    __extends(SmartGraphicsProgram, _super);
    /**
     *
     */
    function SmartGraphicsProgram(aParams, uParams, vColor, vCoords, vLight, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vShaderSrc(aParams, uParams, vColor, vCoords, vLight, glslVersionFromWebGLContextId(void 0, getContextId(contextManager))), fShaderSrc(aParams, uParams, vColor, vCoords, vLight, glslVersionFromWebGLContextId(void 0, getContextId(contextManager))), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName('SmartGraphicsProgram');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    SmartGraphicsProgram.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('SmartGraphicsProgram');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    SmartGraphicsProgram.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return SmartGraphicsProgram;
}(ShaderMaterial));
export { SmartGraphicsProgram };
