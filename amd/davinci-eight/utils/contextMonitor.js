define(["require", "exports", '../utils/uuid4', '../renderers/initWebGL'], function (require, exports, uuid4, initWebGL) {
    var contextMonitor = function (canvas, attributes) {
        var users = [];
        var webGLContextLost = function (event) {
            event.preventDefault();
            users.forEach(function (user) {
                user.contextLoss();
            });
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            var context = initWebGL(canvas, attributes);
            var contextId = uuid4().generate();
            users.forEach(function (user) {
                user.contextGain(context, contextId);
            });
        };
        var publicAPI = {
            start: function (context) {
                context = context || initWebGL(canvas, attributes);
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                var contextId = uuid4().generate();
                users.forEach(function (user) {
                    user.contextGain(context, contextId);
                });
            },
            stop: function () {
                users.forEach(function (user) {
                    user.contextFree();
                });
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            },
            addContextUser: function (user) {
                users.push(user);
            }
        };
        return publicAPI;
    };
    return contextMonitor;
});
