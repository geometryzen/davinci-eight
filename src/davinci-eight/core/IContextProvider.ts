import IUnknown from './IUnknown';
import PrimitiveBuffers from './PrimitiveBuffers';
import Primitive from './Primitive';

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

    /**
     * @method createPrimitiveBuffers
     * @param primitive {Primitive}
     * @param [usage] {number}
     * @return {PrimitiveBuffers}
     */
    createPrimitiveBuffers(primitive: Primitive, usage?: number): PrimitiveBuffers;
}

export default IContextProvider;
