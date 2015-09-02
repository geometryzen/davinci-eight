var initWebGL = require('../renderers/initWebGL');
var expectArg = require('../checks/expectArg');
function contextMonitor(canvas, attributes) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    var users = [];
    var context;
    var refCount = 0;
    var webGLContextLost = function (event) {
        event.preventDefault();
        context = void 0;
        users.forEach(function (user) {
            user.contextLoss();
        });
    };
    var webGLContextRestored = function (event) {
        event.preventDefault();
        context = initWebGL(canvas, attributes);
        users.forEach(function (user) {
            user.contextGain(context);
        });
    };
    var self = {
        start: function () {
            context = initWebGL(canvas, attributes);
            canvas.addEventListener('webglcontextlost', webGLContextLost, false);
            canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
            users.forEach(function (user) { user.contextGain(context); });
            return self;
        },
        stop: function () {
            context = void 0;
            // TODO: contextFree would make sense here, I think, in order to reclaim resources.
            //users.forEach(function(user: RenderingContextUser) {user.contextFree();});
            canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
            canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            return self;
        },
        addContextUser: function (user) {
            expectArg('user', user).toBeObject();
            user.addRef();
            users.push(user);
            if (context) {
                user.contextGain(context);
            }
            return self;
        },
        removeContextUser: function (user) {
            expectArg('user', user).toBeObject();
            var index = users.indexOf(user);
            if (index >= 0) {
                users.splice(index, 1);
                user.release();
            }
            return self;
        },
        get context() {
            return context;
        },
        addRef: function () {
            refCount++;
            // console.log("monitor.addRef() => " + refCount);
        },
        release: function () {
            refCount--;
            // console.log("monitor.release() => " + refCount);
            if (refCount === 0) {
                while (users.length > 0) {
                    users.pop().release();
                }
            }
        }
    };
    return self;
}
;
module.exports = contextMonitor;
