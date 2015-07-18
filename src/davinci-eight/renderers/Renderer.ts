import RenderingContextUser = require('../core/RenderingContextUser');
import VertexUniformProvider = require('../core/VertexUniformProvider');
import World = require('../worlds/World');

interface Renderer extends RenderingContextUser {
  domElement: HTMLCanvasElement;
  render(world: World, views: VertexUniformProvider[]): void;
  clearColor(red: number, green: number, blue: number, alpha: number): void;
  setSize(width: number, height: number): void;
}

export = Renderer;
