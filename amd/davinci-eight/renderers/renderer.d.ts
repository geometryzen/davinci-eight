import ContextRenderer = require('../renderers/ContextRenderer');
/**
 * We need to know the canvasId so that we can tell drawables where to draw.
 * However, we don't need an don't want a canvas because we can only get that once the
 * canvas has loaded. I suppose a promise would be OK, but that's for another day.
 *
 * Part of the role of this class is to manage the commands that are executed at startup/prolog.
 */
declare let renderer: () => ContextRenderer;
export = renderer;
