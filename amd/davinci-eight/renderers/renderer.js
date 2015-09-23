define(["require", "exports", '../core', '../commands/EIGHTLogger', '../commands/ContextAttributesLogger', '../utils/IUnknownArray', '../checks/mustBeBoolean', '../utils/refChange', '../utils/uuid4', '../commands/VersionLogger', '../commands/WebGLClear', '../commands/WebGLClearColor', '../commands/WebGLEnable'], function (require, exports, core, EIGHTLogger, ContextAttributesLogger, IUnknownArray, mustBeBoolean, refChange, uuid4, VersionLogger, WebGLClear, WebGLClearColor, WebGLEnable) {
    function setStartUpCommands(renderer) {
        var cmd;
        // `EIGHT major.minor.patch (GitHub URL) YYYY-MM-DD`
        cmd = new EIGHTLogger();
        renderer.pushStartUp(cmd);
        cmd.release();
        // `WebGL major.minor (OpenGL ES ...)`
        cmd = new VersionLogger();
        renderer.pushStartUp(cmd);
        cmd.release();
        // `alpha, antialias, depth, premultipliedAlpha, preserveDrawingBuffer, stencil`
        cmd = new ContextAttributesLogger();
        renderer.pushStartUp(cmd);
        cmd.release();
        // cmd(red, green, blue, alpha)
        cmd = new WebGLClearColor(0.2, 0.2, 0.2, 1.0);
        renderer.pushStartUp(cmd);
        cmd.release();
        // enable(capability)
        cmd = new WebGLEnable(WebGLRenderingContext.DEPTH_TEST);
        renderer.pushStartUp(cmd);
        cmd.release();
    }
    function setPrologCommands(renderer) {
        var cmd;
        // clear(mask)
        cmd = new WebGLClear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
        renderer.pushProlog(cmd);
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
        // Forced to cache this becuase of the need to avoid duplicating every call by wrapping.
        var _manager;
        //var gl: WebGLRenderingContext = void 0
        //var canvasElement: HTMLCanvasElement;
        //var canvasId: number
        var uuid = uuid4().generate();
        var refCount = 1;
        var _autoProlog = true;
        var prolog = new IUnknownArray();
        var startUp = new IUnknownArray();
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
            get canvasElement() {
                return _manager ? _manager.canvasElement : void 0;
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
            contextLoss: function () {
                _manager = void 0;
            },
            prolog: function () {
                if (_manager) {
                    prolog.forEach(function (command) {
                        command.execute(_manager.gl);
                    });
                }
                else {
                    if (core.verbose) {
                        console.warn("Unable to execute prolog because WebGLRenderingContext is missing.");
                    }
                }
            },
            pushProlog: function (command) {
                prolog.push(command);
            },
            pushStartUp: function (command) {
                startUp.push(command);
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
            },
            // FIXME: Need to be using the uniforms?
            // But we now already know the canvas so maybe not.
            render: function (drawList, ambients) {
                // We have to do this to lazily initialize.
                // FIXME: This means there should be another method that avoid this.
                drawList.contextGain(_manager);
                if (_autoProlog === true) {
                    self.prolog();
                }
                // FIXME: Check for _manager
                var canvasId = _manager.canvasId;
                // FIXME: This seems inefficient, using a callback.
                // Especially since all we do is call draw(canvasId) on each
                function drawHandler(drawable) {
                    drawable.draw(canvasId);
                }
                // We do know the canvasId now so how can we process those uniforms. Who do they go to?
                //
                // The prolog callback for the traverse sets the uniforms on the program.  
                drawList.traverse(drawHandler, canvasId, function (program) {
                    ambients.setUniforms(program, canvasId);
                });
            }
        };
        refChange(uuid, CLASS_NAME, +1);
        setStartUpCommands(self);
        setPrologCommands(self);
        return self;
    };
    return renderer;
});
