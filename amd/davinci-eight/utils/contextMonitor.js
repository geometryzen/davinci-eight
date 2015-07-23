define(["require", "exports", '../utils/uuid4', '../renderers/initWebGL'], function (require, exports, uuid4, initWebGL) {
    function contextMonitor(canvas, attributes) {
        var users = [];
        var context;
        var contextId;
        var webGLContextLost = function (event) {
            event.preventDefault();
            context = void 0;
            contextId = void 0;
            users.forEach(function (user) {
                user.contextLoss();
            });
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            context = initWebGL(canvas, attributes);
            contextId = uuid4().generate();
            users.forEach(function (user) {
                user.contextGain(context, contextId);
            });
        };
        var publicAPI = {
            start: function () {
                context = initWebGL(canvas, attributes);
                contextId = uuid4().generate();
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                users.forEach(function (user) {
                    user.contextGain(context, contextId);
                });
            },
            stop: function () {
                context = void 0;
                contextId = void 0;
                users.forEach(function (user) {
                    user.contextFree();
                });
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            },
            addContextUser: function (user) {
                users.push(user);
                if (context && !user.hasContext()) {
                    user.contextGain(context, contextId);
                }
            },
            get context() {
                return context;
            }
        };
        return publicAPI;
    }
    ;
    return contextMonitor;
});
