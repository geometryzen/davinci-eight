"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeNumber_1 = require("../checks/mustBeNumber");
var expectArg_1 = require("../checks/expectArg");
function defaultSetUp() {
    // Do nothing yet.
}
function defaultTearDown(animateException) {
    if (animateException) {
        var message = "Exception raised during animate function: " + animateException;
        console.warn(message);
    }
}
function defaultTerminate(time) {
    mustBeNumber_1.mustBeNumber('time', time);
    // Never ending, because whenever asked we say nee.
    return false;
}
function animation(animate, options) {
    if (options === void 0) { options = {}; }
    var STATE_INITIAL = 1;
    var STATE_RUNNING = 2;
    var STATE_PAUSED = 3;
    var $window = expectArg_1.expectArg('options.window', options.window || window).toNotBeNull().value;
    var setUp = expectArg_1.expectArg('options.setUp', options.setUp || defaultSetUp).value;
    var tearDown = expectArg_1.expectArg('options.tearDown', options.tearDown || defaultTearDown).value;
    var terminate = expectArg_1.expectArg('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
    var stopSignal = false; // 27 is Esc
    //  let pauseKeyPressed = false  // 19
    //  let enterKeyPressed = false  // 13
    var startTime;
    var elapsed = 0;
    var MILLIS_PER_SECOND = 1000;
    var requestID = null;
    var animateException;
    var state = STATE_INITIAL;
    var onDocumentKeyDown = function (event) {
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
    var frameRequestCallback;
    // The public API is a classic stopwatch.
    // The states are INITIAL, RUNNING, PAUSED.
    var publicAPI = {
        start: function () {
            if (!publicAPI.isRunning) {
                setUp();
                $window.document.addEventListener('keydown', onDocumentKeyDown, false);
                state = STATE_RUNNING;
                requestID = $window.requestAnimationFrame(frameRequestCallback);
            }
        },
        stop: function () {
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
        get time() {
            return elapsed / MILLIS_PER_SECOND;
        },
        lap: function () {
            if (publicAPI.isRunning) {
                // No change of state. We just record the current lap time and save it to some kind of history.
            }
        },
        get isRunning() {
            return state === STATE_RUNNING;
        },
        get isPaused() {
            return state === STATE_PAUSED;
        }
    };
    frameRequestCallback = function (timestamp) {
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
exports.animation = animation;
