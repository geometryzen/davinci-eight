import WindowAnimationRunner = require('../utils/WindowAnimationRunner');
/**
 * Creates an object implementing a stopwatch API that makes callbacks to user-supplied functions.
 * @param tick The `tick` function is called for each animation frame.
 * @param terminate The `terminate` function is called to determine whether the animation should stop.
 * @param setUp The `setUp` function is called synchronously each time the start() method is called.
 * @param tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
 * @param
 */
declare var animationRunner: (tick: (time: number) => void, terminate: (time: number) => void, setUp: () => void, tearDown: (ex: any) => void, $window?: Window) => WindowAnimationRunner;
export = animationRunner;
