import { mustBeArray } from '../checks/mustBeArray';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeObject } from '../checks/mustBeObject';
var context = function () { return "DrawPrimitive constructor"; };
/**
 * A convenience class for implementing the Primitive interface.
 */
var DrawPrimitive = (function () {
    function DrawPrimitive(mode, indices, attributes) {
        this.attributes = {};
        this.mode = mustBeInteger('mode', mode, context);
        this.indices = mustBeArray('indices', indices, context);
        this.attributes = mustBeObject('attributes', attributes, context);
    }
    return DrawPrimitive;
}());
export { DrawPrimitive };
