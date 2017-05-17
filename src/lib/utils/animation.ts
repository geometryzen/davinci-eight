import { BrowserWindow } from '../base/BrowserWindow';
import { mustBeNumber } from '../checks/mustBeNumber';
import { WindowAnimationOptions } from './WindowAnimationOptions';
import { WindowAnimationRunner } from '../utils/WindowAnimationRunner';
import { expectArg } from '../checks/expectArg';

function defaultSetUp(): void {
  // Do nothing yet.
}

function defaultTearDown(animateException: any): void {
  if (animateException) {
    const message = `Exception raised during animate function: ${animateException}`;
    console.warn(message);
  }
}

function defaultTerminate(time: number): boolean {
  mustBeNumber('time', time);
  // Never ending, because whenever asked we say nee.
  return false;
}

export function animation(animate: (time: number) => void, options: WindowAnimationOptions = {}): WindowAnimationRunner {

  const STATE_INITIAL = 1;
  const STATE_RUNNING = 2;
  const STATE_PAUSED = 3;

  const $window: BrowserWindow = expectArg('options.window', options.window || window).toNotBeNull().value;
  const setUp: () => void = expectArg('options.setUp', options.setUp || defaultSetUp).value;
  const tearDown: (animateException: any) => void = expectArg('options.tearDown', options.tearDown || defaultTearDown).value;
  const terminate: (time: number) => boolean = expectArg('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;

  let stopSignal = false;       // 27 is Esc
  //  let pauseKeyPressed = false  // 19
  //  let enterKeyPressed = false  // 13
  let startTime: number;
  let elapsed = 0;
  const MILLIS_PER_SECOND = 1000;
  let requestID: number = null;
  let animateException: any;
  let state = STATE_INITIAL;

  const onDocumentKeyDown = function (event: KeyboardEvent) {
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

  let frameRequestCallback: FrameRequestCallback;

  // The public API is a classic stopwatch.
  // The states are INITIAL, RUNNING, PAUSED.
  const publicAPI: WindowAnimationRunner = {
    start() {
      if (!publicAPI.isRunning) {
        setUp();
        $window.document.addEventListener('keydown', onDocumentKeyDown, false);
        state = STATE_RUNNING;
        requestID = $window.requestAnimationFrame(frameRequestCallback);
      }
    },
    stop() {
      if (publicAPI.isRunning) {
        stopSignal = true;
      }
    },
    reset: function () {
      if (publicAPI.isPaused) {
        startTime = void 0;
        elapsed = 0;
        state = STATE_INITIAL;
      }
    },
    get time(): number {
      return elapsed / MILLIS_PER_SECOND;
    },
    lap: function () {
      if (publicAPI.isRunning) {
        // No change of state. We just record the current lap time and save it to some kind of history.
      }
    },
    get isRunning(): boolean {
      return state === STATE_RUNNING;
    },
    get isPaused(): boolean {
      return state === STATE_PAUSED;
    }
  };

  frameRequestCallback = function (timestamp: number) {
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
        startTime = void 0;
      }
      else {
        // TODO: Can we recover?
        console.error("stopSignal received while not running.");
      }
      $window.document.removeEventListener('keydown', onDocumentKeyDown, false);
      try {
        tearDown(animateException);
      }
      catch (e) {
        console.warn("Exception raised during tearDown function: " + e);
      }
    }
    else {
      requestID = $window.requestAnimationFrame(frameRequestCallback);
      // If an exception happens, cache it to be reported later and simulate a stopSignal.
      try {
        animate(elapsed / MILLIS_PER_SECOND);
      }
      catch (e) {
        animateException = e;
        stopSignal = true;
      }
    }
  };

  return publicAPI;
}
