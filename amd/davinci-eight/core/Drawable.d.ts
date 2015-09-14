import DrawableVisitor = require('../core/DrawableVisitor');
import Resource = require('../core/Resource');
import Program = require('../core/Program');
/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGLRenderingContext.
 * @class Drawable
 * @extends Resource
 */
interface Drawable extends Resource {
    /**
     * @property program
     */
    program: Program;
    /**
     * @method accept
     * @param visitor {DrawableVisitor}
     */
    accept(visitor: DrawableVisitor): any;
}
export = Drawable;
