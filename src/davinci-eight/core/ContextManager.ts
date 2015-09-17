import ContextListener = require('../core/ContextListener');
import ContextUnique = require('../core/ContextUnique');
import DrawElements = require('../dfx/DrawElements');
import IBuffer = require('../core/IBuffer');
import IMesh = require('../dfx/IMesh');
// FIXME: Do we need IProgram?
import IProgram = require('../core/IProgram');
import ITexture2D = require('../core/ITexture2D');
import ITextureCubeMap = require('../core/ITextureCubeMap');
import IUnknown = require('../core/IUnknown');

// The IContextManager 
// FIXME: Rename to IContextManager? Does it hold weak or strong references?
// FIXME IUnknown?

/**
 * @interface ContextManager
 * @extends ContextUnique
 * @extends IUnknown
 */
 // FIXME Try commenting out IUnknown
interface ContextManager extends ContextUnique, IUnknown {
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  clearDepth(depth: number): void;
  createArrayBuffer(): IBuffer;
  createElementArrayBuffer(): IBuffer;
  createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh;
  createTexture2D(): ITexture2D;
  createTextureCubeMap(): ITextureCubeMap;
  drawArrays(mode: number, first: number, count: number): void;
  drawElements(mode: number, count: number, type: number, offset: number): void;
  depthFunc(func: number): void;
  enable(capability: number): void;
  gl: WebGLRenderingContext;
  mirror: boolean;
}

export = ContextManager;
