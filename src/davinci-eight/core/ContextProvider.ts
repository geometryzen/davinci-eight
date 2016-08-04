import BeginMode from './BeginMode';
import DataType from './DataType';
import {Shareable} from './Shareable';

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

    /**
     * @method disableVertexAttribArray
     * @param index {number}
     * @return {void}
     */
    disableVertexAttribArray(index: number): void;

    /**
     * Sets whether writing to the depth buffer is enabled or disabled.
     */
    depthMask(flag: boolean): void;

    /**
     * Render geometric primitives from bound and enabled vertex data.
     *
     * @param mode Specifies the kind of geometric primitives to render from a given set of vertex attributes.
     * @param first The first element to render in the array of vector points.
     * @param count The number of vector points to render. For example, a triangle would be 3.
     * @return {void}
     */
    drawArrays(mode: BeginMode, first: number, count: number): void

    /**
     * @param mode
     * @param count
     * @param offset
     */
    drawElements(mode: BeginMode, count: number, offset: number): void

    /**
     * @method enableVertexAttribArray
     * @param index {number}
     * @return {void}
     */
    enableVertexAttribArray(index: number): void;

    /**
     * @method isContextLost
     * @return boolean
     */
    isContextLost(): boolean;

    /**
     * @method vertexAttribPointer
     * @param index
     * @param size
     * @param type
     * @param normalized
     * @param stride
     * @param offset
     */
    vertexAttribPointer(index: number, size: number, type: DataType, normalized: boolean, stride: number, offset: number): void;
}

export default ContextProvider;
