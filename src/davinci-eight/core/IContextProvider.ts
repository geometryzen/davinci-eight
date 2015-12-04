import IContextConsumer = require('../core/IContextConsumer');
import IContextMonitor = require('../core/IContextMonitor');
import ContextUnique = require('../core/ContextUnique');
import IBuffer = require('../core/IBuffer')
import IBufferGeometry = require('../geometries/IBufferGeometry')
import ITexture2D = require('../core/ITexture2D')
import ITextureCubeMap = require('../core/ITextureCubeMap')
import IUnknown = require('../core/IUnknown')
import Primitive = require('../geometries/Primitive')

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

export = IContextProvider;
