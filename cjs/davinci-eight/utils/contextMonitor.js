var uuid4 = require('../utils/uuid4');
var initWebGL = require('../renderers/initWebGL');
var expectArg = require('../checks/expectArg');
function contextMonitor(canvas, attributes) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
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
    var self = {
        start: function () {
            context = initWebGL(canvas, attributes);
            contextId = uuid4().generate();
            canvas.addEventListener('webglcontextlost', webGLContextLost, false);
            canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
            users.forEach(function (user) {
                user.contextGain(context, contextId);
            });
            return self;
        },
        stop: function () {
            context = void 0;
            contextId = void 0;
            users.forEach(function (user) {
                user.contextFree();
            });
            canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
            canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            return self;
        },
        addContextUser: function (user) {
            expectArg('user', user).toBeObject();
            users.push(user);
            if (context && !user.hasContext()) {
                user.contextGain(context, contextId);
            }
            return self;
        },
        get context() {
            return context;
        }
    };
    return self;
}
;
module.exports = contextMonitor;
