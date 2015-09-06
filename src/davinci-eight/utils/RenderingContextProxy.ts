import ReferenceCounted = require('../core/ReferenceCounted');
import RenderingContextUser = require('../core/RenderingContextUser');
import Texture = require('../resources/Texture');

interface RenderingContextProxy extends ReferenceCounted {
  start(): RenderingContextProxy;
  stop(): RenderingContextProxy;
  addContextUser(user: RenderingContextUser): RenderingContextProxy;
  removeContextUser(user: RenderingContextUser): RenderingContextProxy;
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  clearDepth(depth: number): void;
  drawArrays(mode: number, first: number, count: number): void;
  drawElements(mode: number, count: number, type: number, offset: number): void;
  depthFunc(func: number): void;
  enable(capability: number): void;
  context: WebGLRenderingContext;
  createTexture(): Texture;
}

export = RenderingContextProxy;
