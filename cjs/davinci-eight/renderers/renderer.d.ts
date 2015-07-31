import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
declare let renderer: (canvas: HTMLCanvasElement, parameters?: RendererParameters) => Renderer;
export = renderer;
