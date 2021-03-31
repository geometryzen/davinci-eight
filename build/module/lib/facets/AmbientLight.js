import { Color } from '../core/Color';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 * Sets the 'uAmbientLight' uniform to the color RGB value.
 */
var AmbientLight = /** @class */ (function () {
    /**
     *
     */
    function AmbientLight(color) {
        mustBeObject('color', color);
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone();
        this.color.r = mustBeNumber('color.r', color.r);
        this.color.g = mustBeNumber('color.g', color.g);
        this.color.b = mustBeNumber('color.b', color.b);
    }
    /**
     *
     */
    AmbientLight.prototype.setUniforms = function (visitor) {
        var color = this.color;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b);
    };
    return AmbientLight;
}());
export { AmbientLight };
