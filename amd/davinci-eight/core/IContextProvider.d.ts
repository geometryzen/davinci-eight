import ContextMonitor = require('../core/ContextMonitor');
import GeometryData = require('../dfx/GeometryData');
import IBuffer = require('../core/IBuffer');
import IBufferGeometry = require('../dfx/IBufferGeometry');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknown = require('../core/IUnknown');
/**
 * @class IContextProvider
 * @extends ContextUnique
 * @extends IUnknown
 */
interface IContextProvider extends ContextMonitor, IUnknown {
    createArrayBuffer(): IBuffer;
    createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
    createElementArrayBuffer(): IBuffer;
    createTexture2D(): ITexture2D;
    createTextureCubeMap(): ITextureCubeMap;
    gl: WebGLRenderingContext;
    /**
     * @property canvasElement
     * @type {HTMLCanvasElement}
     * @readOnly
     */
    canvasElement: HTMLCanvasElement;
}
export = IContextProvider;
