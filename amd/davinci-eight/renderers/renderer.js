define(["require", "exports", '../collections/IUnknownArray', '../utils/refChange', '../utils/uuid4', '../commands/WebGLClearColor', '../commands/WebGLEnable', '../commands/WebGLDisable'], function (require, exports, IUnknownArray, refChange, uuid4, WebGLClearColor, WebGLEnable, WebGLDisable) {
    var CLASS_NAME = "CanonicalIContextRenderer";
    /**
     * We need to know the canvasId so that we can tell drawables where to draw.
     * However, we don't need an don't want a canvas because we can only get that once the
     * canvas has loaded. I suppose a promise would be OK, but that's for another day.
     *
     * Part of the role of this class is to manage the commands that are executed at startup/prolog.
     */
    var renderer = function () {
        var _manager;
        var uuid = uuid4().generate();
        var refCount = 1;
        var commands = new IUnknownArray([]);
        var self = {
            addRef: function () {
                refCount++;
                refChange(uuid, CLASS_NAME, +1);
                return refCount;
            },
            get canvas() {
                return _manager ? _manager.canvas : void 0;
            },
            get commands() {
                return commands;
            },
            get gl() {
                return _manager ? _manager.gl : void 0;
            },
            clearColor: function (red, green, blue, alpha) {
                commands.pushWeakRef(new WebGLClearColor(red, green, blue, alpha));
            },
            contextFree: function (canvasId) {
                commands.forEach(function (command) {
                    command.contextFree(canvasId);
                });
                _manager = void 0;
            },
            contextGain: function (manager) {
                // This object is single context, so we only ever get called with one manager at a time (serially).
                _manager = manager;
                commands.forEach(function (command) {
                    command.contextGain(manager);
                });
            },
            contextLost: function (canvasId) {
                commands.forEach(function (command) {
                    command.contextLost(canvasId);
                });
                _manager = void 0;
            },
            disable: function (capability) {
                commands.pushWeakRef(new WebGLDisable(capability));
            },
            enable: function (capability) {
                commands.pushWeakRef(new WebGLEnable(capability));
            },
            viewport: function (x, y, width, height) {
                return self.gl.viewport(x, y, width, height);
            },
            release: function () {
                refCount--;
                refChange(uuid, CLASS_NAME, -1);
                if (refCount === 0) {
                    commands.release();
                    commands = void 0;
                    return 0;
                }
                else {
                    return refCount;
                }
            }
        };
        refChange(uuid, CLASS_NAME, +1);
        return self;
    };
    return renderer;
});
