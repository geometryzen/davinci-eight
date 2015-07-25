import WindowAnimationRunner = require('../utils/WindowAnimationRunner');
/**
 * Creates an object implementing a stopwatch API that makes callbacks to user-supplied functions.
 * @param animate The `animate` function is called for each animation frame.
 * @param options.setUp The `setUp` function is called synchronously each time the start() method is called.
 * @param options.tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
 * @param options.terminate The `terminate` function is called to determine whether the animation should stop.
 * @param options.window {Window} The window in which the animation will run. Defaults to the global window.
 */
declare var animation: (animate: (time: number) => void, options?: {
    setUp?: () => void;
    tearDown?: (animateException: any) => void;
    terminate?: (time: number) => boolean;
    window?: Window;
}) => WindowAnimationRunner;
export = animation;
