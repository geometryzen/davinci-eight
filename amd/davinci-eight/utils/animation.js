define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg_1) {
    function defaultSetUp() {
    }
    function defaultTearDown(animateException) {
        if (animateException) {
            var message = "Exception raised during animate function: " + animateException;
            console.warn(message);
        }
    }
    function defaultTerminate(time) {
        return false;
    }
    function animation(animate, options) {
        var STATE_INITIAL = 1;
        var STATE_RUNNING = 2;
        var STATE_PAUSED = 3;
        options = options || {};
        var $window = expectArg_1.default('options.window', options.window || window).toNotBeNull().value;
        var setUp = expectArg_1.default('options.setUp', options.setUp || defaultSetUp).value;
        var tearDown = expectArg_1.default('options.tearDown', options.tearDown || defaultTearDown).value;
        var terminate = expectArg_1.default('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
        var stopSignal = false;
        var startTime;
        var elapsed = 0;
        var MILLIS_PER_SECOND = 1000;
        var requestID = null;
        var animateException;
        var state = STATE_INITIAL;
        var frameRequestCallback = function (timestamp) {
            if (startTime) {
                elapsed = elapsed + timestamp - startTime;
            }
            startTime = timestamp;
            if (stopSignal || terminate(elapsed / MILLIS_PER_SECOND)) {
                stopSignal = false;
                $window.cancelAnimationFrame(requestID);
                if (publicAPI.isRunning) {
                    state = STATE_PAUSED;
                    startTime = void 0;
                }
                else {
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
                try {
                    animate(elapsed / MILLIS_PER_SECOND);
                }
                catch (e) {
                    animateException = e;
                    stopSignal = true;
                }
            }
        };
        var onDocumentKeyDown = function (event) {
            if (event.keyCode === 27) {
                stopSignal = true;
                event.preventDefault();
            }
        };
        var publicAPI = {
            start: function () {
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
            stop: function () {
                if (publicAPI.isRunning) {
                    stopSignal = true;
                }
                else {
                    throw new Error("The `stop` method may only be called when running.");
                }
            },
            reset: function () {
                if (publicAPI.isPaused) {
                    startTime = void 0;
                    elapsed = 0;
                    state = STATE_INITIAL;
                }
                else {
                    throw new Error("The `reset` method may only be called when paused.");
                }
            },
            get time() {
                return elapsed / MILLIS_PER_SECOND;
            },
            lap: function () {
                if (publicAPI.isRunning) {
                }
                else {
                    throw new Error("The `lap` method may only be called when running.");
                }
            },
            get isRunning() {
                return state === STATE_RUNNING;
            },
            get isPaused() {
                return state === STATE_PAUSED;
            }
        };
        return publicAPI;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = animation;
});
