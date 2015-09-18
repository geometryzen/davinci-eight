import ContextRenderer = require('../renderers/ContextRenderer');
/**
 *
 */
declare let renderer: (canvas: HTMLCanvasElement, canvasId: number) => ContextRenderer;
export = renderer;
