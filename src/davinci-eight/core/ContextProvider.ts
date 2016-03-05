import Shareable from './Shareable';

/**
 * @module EIGHT
 * @submodule core
 * @class ContextProvider
 * @extends Shareable
 */
interface ContextProvider extends Shareable {
    /**
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    gl: WebGLRenderingContext;
}

export default ContextProvider;
