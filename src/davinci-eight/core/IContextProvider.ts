import IContextConsumer from '../core/IContextConsumer';
import IContextMonitor from '../core/IContextMonitor';
import ContextUnique from '../core/ContextUnique';
import IBuffer from '../core/IBuffer';
import IBufferGeometry from '../geometries/IBufferGeometry';
import ITexture2D from '../core/ITexture2D';
import ITextureCubeMap from '../core/ITextureCubeMap';
import IUnknown from '../core/IUnknown';
import Primitive from '../geometries/Primitive';

/**
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
     * @return {IBuffer}
     */
    createArrayBuffer(): IBuffer;

    /**
     * @method createBufferGeometry
     * @param primitive {Primitive}
     * @param [usage] {number}
     * @return {IBufferGeometry}
     */
    createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry;

    /**
     * @method createElementArrayBuffer
     * @return {IBuffer}
     */
    createElementArrayBuffer(): IBuffer;

    /**
     * @method createTexture2D
     * @return {ITexture2D}
     */
    createTexture2D(): ITexture2D;

    /**
     * @method createTextureCubeMap
     * @return {ITextureCubeMap}
     */
    createTextureCubeMap(): ITextureCubeMap;

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
