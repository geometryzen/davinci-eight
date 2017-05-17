"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fragmentShaderSrc_1 = require("./fragmentShaderSrc");
var ShaderMaterial_1 = require("./ShaderMaterial");
var vertexShaderSrc_1 = require("./vertexShaderSrc");
/**
 * A Material that is generated based upon knowledge of parameters and some hints.
 */
var SmartGraphicsProgram = (function (_super) {
    tslib_1.__extends(SmartGraphicsProgram, _super);
    /**
     *
     */
    function SmartGraphicsProgram(aParams, uParams, vColor, vCoords, vLight, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc_1.vertexShaderSrc(aParams, uParams, vColor, vCoords, vLight), fragmentShaderSrc_1.fragmentShaderSrc(aParams, uParams, vColor, vCoords, vLight), [], contextManager, levelUp + 1) || this;
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
}(ShaderMaterial_1.ShaderMaterial));
exports.SmartGraphicsProgram = SmartGraphicsProgram;
