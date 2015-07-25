import Viewport = require('../renderers/Viewport');
import ViewportParameters = require('../renderers/ViewportParameters');
declare let viewport: (canvas: HTMLCanvasElement, parameters: ViewportParameters) => Viewport;
export = viewport;
