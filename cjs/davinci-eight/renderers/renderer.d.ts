import Renderer = require('../renderers/Renderer');
import RendererParameters = require('../renderers/RendererParameters');
declare var renderer: (parameters?: RendererParameters) => Renderer;
export = renderer;
