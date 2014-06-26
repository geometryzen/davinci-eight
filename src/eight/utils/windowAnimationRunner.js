define(["require", "exports"], function(require, exports) {
    var windowAnimationRunner = function (tick, terminate, setUp, tearDown, win) {
        win = win || window;
        var escKeyPressed = false;
        var pauseKeyPressed = false;
        var enterKeyPressed = false;
        var startTime = null;
        var elapsed = null;
        var MILLIS_PER_SECOND = 1000;
        var requestID = null;
        var exception = null;

        var animate = function (timestamp) {
            if (startTime) {
                elapsed = timestamp - startTime;
            } else {
                startTime = timestamp;
                elapsed = 0;
            }

            if (escKeyPressed || terminate(elapsed / MILLIS_PER_SECOND)) {
                escKeyPressed = false;

                win.cancelAnimationFrame(requestID);
                win.document.removeEventListener('keydown', onDocumentKeyDown, false);
                try  {
                    tearDown(exception);
                } catch (e) {
                    console.log(e);
                }
            } else {
                requestID = win.requestAnimationFrame(animate);
                try  {
                    tick(elapsed / MILLIS_PER_SECOND);
                } catch (e) {
                    exception = e;
                    escKeyPressed = true;
                }
            }
        };

        var onDocumentKeyDown = function (event) {
            if (event.keyCode == 27) {
                escKeyPressed = true;
                event.preventDefault();
            } else if (event.keyCode == 19) {
                pauseKeyPressed = true;
                event.preventDefault();
            } else if (event.keyCode == 13) {
                enterKeyPressed = true;
                event.preventDefault();
            }
        };

        var that = {
            start: function () {
                setUp();
                win.document.addEventListener('keydown', onDocumentKeyDown, false);
                requestID = win.requestAnimationFrame(animate);
            },
            stop: function () {
                escKeyPressed = true;
            }
        };

        return that;
    };

    
    return windowAnimationRunner;
});
