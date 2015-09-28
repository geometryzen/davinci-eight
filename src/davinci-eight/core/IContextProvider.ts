import IContextConsumer = require('../core/IContextConsumer');
import ContextMonitor = require('../core/ContextMonitor');
import ContextUnique = require('../core/ContextUnique');
import SerialGeometryElements = require('../dfx/SerialGeometryElements');
import IBuffer = require('../core/IBuffer');
import IBufferGeometry = require('../dfx/IBufferGeometry');
// FIXME: Do we need IMaterial?
import IMaterial = require('../core/IMaterial');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknown = require('../core/IUnknown');

// The IIContextProvider 
// FIXME: Rename to IIContextProvider? Does it hold weak or strong references?
// FIXME IUnknown?

/**
 * @class IContextProvider
 * @extends ContextUnique
 * @extends IUnknown
 */
interface IContextProvider extends ContextMonitor, IUnknown {
  createArrayBuffer(): IBuffer;
  createBufferGeometry(elements: SerialGeometryElements, mode?: number, usage?: number): IBufferGeometry;
  createElementArrayBuffer(): IBuffer;
  createTexture2D(): ITexture2D;
  createTextureCubeMap(): ITextureCubeMap;
  gl: WebGLRenderingContext;
  /**
   * @property canvas
   * @type {HTMLCanvasElement}
   * @readOnly
   */
  canvas: HTMLCanvasElement;
}

export = IContextProvider;
