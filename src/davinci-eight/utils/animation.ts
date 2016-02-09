import WindowAnimationRunner from '../utils/WindowAnimationRunner';
import expectArg from '../checks/expectArg';

function defaultSetUp(): void {
}

function defaultTearDown(animateException: any): void {
    if (animateException) {
        let message = "Exception raised during animate function: " + animateException;
        console.warn(message);
    }
}

function defaultTerminate(time: number): boolean {
    // Never ending, because whenever asked we say nee.
    return false;
}

export default function animation(
    animate: (time: number) => void,
    options?: {
        setUp?: () => void;
        tearDown?: (animateException: any) => void;
        terminate?: (time: number) => boolean;
        window?: Window
    }): WindowAnimationRunner {

    // TODO: Use enum when TypeScript compiler version is appropriate.
    var STATE_INITIAL = 1;
    var STATE_RUNNING = 2;
    var STATE_PAUSED = 3;

    options = options || {};

    let $window: Window = expectArg('options.window', options.window || window).toNotBeNull().value;
    let setUp: () => void = expectArg('options.setUp', options.setUp || defaultSetUp).value;
    let tearDown: (animateException: any) => void = expectArg('options.tearDown', options.tearDown || defaultTearDown).value;
    let terminate: (time: number) => boolean = expectArg('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;

    var stopSignal = false;       // 27 is Esc
    //  var pauseKeyPressed = false;  // 19
    //  var enterKeyPressed = false;  // 13
    var startTime: number;
    var elapsed: number = 0;
    var MILLIS_PER_SECOND = 1000;
    var requestID: number = null;
    var animateException: any;
    var state = STATE_INITIAL;

    let frameRequestCallback: FrameRequestCallback = function(timestamp: number) {
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
                requestID = $window.requestAnimationFrame(frameRequestCallback);
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
                startTime = void 0;
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
}
