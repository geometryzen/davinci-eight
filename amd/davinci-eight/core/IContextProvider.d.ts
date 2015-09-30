import IContextConsumer = require('../core/IContextConsumer');
import ContextMonitor = require('../core/ContextMonitor');
import GeometryData = require('../geometries/GeometryData');
import IBuffer = require('../core/IBuffer');
import IBufferGeometry = require('../geometries/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknown = require('../core/IUnknown');
/**
 * @class IContextProvider
 * @extends ContextMonitor
 * @extends IUnknown
 */
interface IContextProvider extends ContextMonitor, IUnknown {
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
     * @param elements {GeometryData}
     * @param mode [number]
     * @param usage [number]
     * @return {IBufferGeometry}
     */
    createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
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
export = IContextProvider;
