define(["require", "exports", '../core', '../commands/EIGHTLogger', '../utils/IUnknownArray', '../checks/mustBeBoolean', '../utils/refChange', '../utils/uuid4', '../commands/VersionLogger', '../commands/WebGLClear', '../commands/WebGLClearColor', '../commands/WebGLEnable'], function (require, exports, core, EIGHTLogger, IUnknownArray, mustBeBoolean, refChange, uuid4, VersionLogger, WebGLClear, WebGLClearColor, WebGLEnable) {
    function setStartUpCommands(renderer) {
        var cmd;
        // `EIGHT major.minor.patch (GitHub URL) YYYY-MM-DD`
        cmd = new EIGHTLogger();
        renderer.addContextGainCommand(cmd);
        cmd.release();
        // `WebGL major.minor (OpenGL ES ...)`
        cmd = new VersionLogger();
        renderer.addContextGainCommand(cmd);
        cmd.release();
        // `alpha, antialias, depth, premultipliedAlpha, preserveDrawingBuffer, stencil`
        // cmd = new ContextAttributesLogger()
        // renderer.addContextGainCommand(cmd)
        // cmd.release()
        // cmd(red, green, blue, alpha)
        cmd = new WebGLClearColor(0.2, 0.2, 0.2, 1.0);
        renderer.addContextGainCommand(cmd);
        cmd.release();
        // enable(capability)
        cmd = new WebGLEnable(WebGLRenderingContext.DEPTH_TEST);
        renderer.addContextGainCommand(cmd);
        cmd.release();
    }
    function setPrologCommands(renderer) {
        var cmd;
        // clear(mask)
        cmd = new WebGLClear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
        renderer.addPrologCommand(cmd);
        cmd.release();
    }
    var CLASS_NAME = "CanonicalContextRenderer";
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
        var _autoProlog = true;
        var prolog = new IUnknownArray([], CLASS_NAME);
        var startUp = new IUnknownArray([], CLASS_NAME);
        var self = {
            addRef: function () {
                refCount++;
                refChange(uuid, CLASS_NAME, +1);
                return refCount;
            },
            get autoProlog() {
                return _autoProlog;
            },
            set autoProlog(autoProlog) {
                mustBeBoolean('autoProlog', autoProlog);
                _autoProlog = autoProlog;
            },
            get canvas() {
                return _manager ? _manager.canvas : void 0;
            },
            get gl() {
                return _manager ? _manager.gl : void 0;
            },
            contextFree: function () {
                _manager = void 0;
            },
            contextGain: function (manager) {
                // This object is single context, so we only ever get called with one manager at a time (serially).
                _manager = manager;
                startUp.forEach(function (command) {
                    command.execute(manager.gl);
                });
            },
            contextLost: function () {
                _manager = void 0;
            },
            prolog: function () {
                if (_manager) {
                    for (var i = 0, length = prolog.length; i < length; i++) {
                        var command = prolog.get(i);
                        command.execute(_manager);
                        command.release();
                    }
                }
                else {
                    if (core.verbose) {
                        console.warn("Unable to execute prolog because WebGLRenderingContext is missing.");
                    }
                }
            },
            addPrologCommand: function (command) {
                prolog.push(command);
                return command;
            },
            addContextGainCommand: function (command) {
                startUp.push(command);
                return command;
            },
            release: function () {
                refCount--;
                refChange(uuid, CLASS_NAME, -1);
                if (refCount === 0) {
                    prolog.release();
                    prolog = void 0;
                    startUp.release();
                    startUp = void 0;
                    return 0;
                }
                else {
                    return refCount;
                }
            }
        };
        refChange(uuid, CLASS_NAME, +1);
        setStartUpCommands(self);
        setPrologCommands(self);
        return self;
    };
    return renderer;
});
