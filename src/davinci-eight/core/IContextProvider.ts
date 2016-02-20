import IUnknown from './IUnknown';

/**
 * @module EIGHT
 * @submodule core
 * @class IContextProvider
 * @extends IUnknown
 */
interface IContextProvider extends IUnknown {
    /**
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    gl: WebGLRenderingContext;
}

export default IContextProvider;
