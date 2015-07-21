import WindowAnimationRunner = require('../utils/WindowAnimationRunner');
/**
 * Creates an object implementing a stopwatch API that makes callbacks to user-supplied functions.
 * @param tick The `tick` function is called for each animation frame.
 * @param terminate The `terminate` function is called to determine whether the animation should stop.
 * @param setUp The `setUp` function is called synchronously each time the start() method is called.
 * @param tearDown The `tearDown` function is called asynchronously each time the animation is stopped.
 * @param 
 */
var animationRunner = function(
  tick: (time: number) => void,
  terminate: (time: number) => void,
  setUp: () => void,
  tearDown: (ex: any) => void,
  $window?: Window): WindowAnimationRunner {

    // TODO: Use enum when TypeScript compiler version is appropriate.
    var STATE_INITIAL = 1;
    var STATE_RUNNING = 2;
    var STATE_PAUSED = 3;

    $window = $window || window;
    var stopSignal = false;       // 27 is Esc
//  var pauseKeyPressed = false;  // 19
//  var enterKeyPressed = false;  // 13
    var startTime: number = undefined;
    var elapsed: number = 0;
    var MILLIS_PER_SECOND = 1000;
    var requestID: number = null;
    var exception: any = undefined;
    var state = STATE_INITIAL;

    var animate: FrameRequestCallback = function(timestamp: number) {
      if (startTime) {
        elapsed = elapsed + timestamp - startTime;
      }
      startTime = timestamp;

      if (stopSignal || terminate(elapsed / MILLIS_PER_SECOND)) {
        // Clear the stopSignal.
        stopSignal = false;

        $window.cancelAnimationFrame(requestID);
        if (publicAPI.isRunning) {
          state = STATE_PAUSED;
          startTime = undefined;
        }
        else {
          // TODO: Can we recover?
          console.error("stopSignal received while not running.");
        }
        $window.document.removeEventListener('keydown', onDocumentKeyDown, false);
        try {
          tearDown(exception);
        }
        catch (e) {
          console.log("Exception thrown from tearDown function: " + e);
        }
      }
      else {
        requestID = $window.requestAnimationFrame(animate);
        // If an exception happens, cache it to be reported later and simulate a stopSignal.
        try {
          tick(elapsed / MILLIS_PER_SECOND);
        }
        catch (e) {
          exception = e;
          stopSignal = true;
        }
      }
    };

    var onDocumentKeyDown = function(event: KeyboardEvent) {
      // TODO: It would be nice for all key responses to be soft-defined.
      // In other words, a mapping of event (keyCode) to action (start, stop, reset)
      if (event.keyCode === 27) {
        stopSignal = true;
        event.preventDefault();
      }
      /*
      else if (event.keyCode === 19) {
        pauseKeyPressed = true;
        event.preventDefault();
      }
      else if (event.keyCode === 13) {
        enterKeyPressed = true;
        event.preventDefault();
      }
      */
    };

    // The public API is a classic stopwatch.
    // The states are INITIAL, RUNNING, PAUSED.
    var publicAPI: WindowAnimationRunner = {
      start() {
        if (!publicAPI.isRunning) {
          setUp();
          $window.document.addEventListener('keydown', onDocumentKeyDown, false);
          state = STATE_RUNNING;
          requestID = $window.requestAnimationFrame(animate);
        }
        else {
          throw new Error("The `start` method may only be called when not running.");
        }
      },
      stop() {
        if (publicAPI.isRunning) {
          stopSignal = true;
        }
        else {
          throw new Error("The `stop` method may only be called when running.");
        }
      },
      reset: function() {
        if (publicAPI.isPaused) {
          startTime = undefined;
          elapsed = 0;
          state = STATE_INITIAL;
        }
        else {
          throw new Error("The `reset` method may only be called when paused.");
        }
      },
      get time(): number {
        return elapsed / MILLIS_PER_SECOND;
      },
      lap: function() {
        if (publicAPI.isRunning) {
          // No change of state. We just record the current lap time and save it to some kind of history.
        }
        else {
          throw new Error("The `lap` method may only be called when running.");
        }
      },
      get isRunning(): boolean {
        return state === STATE_RUNNING;
      },
      get isPaused(): boolean {
        return state === STATE_PAUSED;
      }
    };

    return publicAPI;
};

export = animationRunner;
