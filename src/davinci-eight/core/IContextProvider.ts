import IContextConsumer from './IContextConsumer';
import IContextMonitor from './IContextMonitor';
import ShareableWebGLBuffer from './ShareableWebGLBuffer';
import ShareableWebGLTexture from './ShareableWebGLTexture';
import IBufferGeometry from './IBufferGeometry';
import Primitive from './Primitive';

/**
 * @module EIGHT
 * @submodule core
 * @class IContextProvider
 * @extends IContextMonitor
 */
interface IContextProvider extends IContextMonitor {

    /**
     * @property canvas
     * @type {HTMLCanvasElement}
     * @readOnly
     */
    canvas: HTMLCanvasElement;

    /**
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    gl: WebGLRenderingContext;

    /**
     * @method addContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    addContextListener(user: IContextConsumer): void;

    /**
     * @method createArrayBuffer
     * @return {ShareableWebGLBuffer}
     */
    createArrayBuffer(): ShareableWebGLBuffer;

    /**
     * @method createBufferGeometry
     * @param primitive {Primitive}
     * @param [usage] {number}
     * @return {IBufferGeometry}
     */
    createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry;

    /**
     * @method createElementArrayBuffer
     * @return {ShareableWebGLBuffer}
     */
    createElementArrayBuffer(): ShareableWebGLBuffer;

    /**
     * @method createTexture2D
     * @return {ShareableWebGLTexture}
     */
    createTexture2D(): ShareableWebGLTexture;

    /**
     * @method createTextureCubeMap
     * @return {ShareableWebGLTexture}
     */
    createTextureCubeMap(): ShareableWebGLTexture;

    /**
     * @method removeContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    removeContextListener(user: IContextConsumer): void;

    /**
     * @method synchronize
     * @param user {IContextConsumer}
     * @return {void}
     */
    synchronize(user: IContextConsumer): void;
}

export default IContextProvider;
