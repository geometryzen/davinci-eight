import IContextCommand = require('../core/IContextCommand');
import mustBeNumber = require('../checks/mustBeNumber');
import Shareable = require('../utils/Shareable');

var QUALIFIED_NAME = 'EIGHT.WebGLContextAttributesLogger'

/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p> 
 * @class ContextAttributesLogger
 * @extends Shareable
 * @implements IContextCommand
 */
class ContextAttributesLogger extends Shareable implements IContextCommand {
  constructor() {
    super(QUALIFIED_NAME)
  }
  execute(gl: WebGLRenderingContext): void {
    let attributes: WebGLContextAttributes = gl.getContextAttributes();
    console.log("alpha                 => " + attributes.alpha);
    console.log("antialias             => " + attributes.antialias);
    console.log("depth                 => " + attributes.depth);
    console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
    console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
    console.log("stencil               => " + attributes.stencil);
  }
  destructor(): void {
  }
  get name(): string {
    return QUALIFIED_NAME
  }
}

export = ContextAttributesLogger;