define(["require", "exports", '../commands/EIGHTLogger', '../checks/expectArg', '../commands/ContextAttributesLogger', '../utils/IUnknownArray', '../utils/refChange', '../utils/uuid4', '../commands/VersionLogger', '../commands/WebGLClear', '../commands/WebGLClearColor', '../commands/WebGLEnable'], function (require, exports, EIGHTLogger, expectArg, ContextAttributesLogger, IUnknownArray, refChange, uuid4, VersionLogger, WebGLClear, WebGLClearColor, WebGLEnable) {
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
     *
     */
    var renderer = function (canvas, canvasId) {
        // FIXME: Replace.
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        // Forced to cache this becuase of the need to avoid duplicating every call by wrapping.
        var gl = void 0;
        var uuid = uuid4().generate();
        var refCount = 1;
        var prolog = new IUnknownArray();
        var startUp = new IUnknownArray();
        function drawHandler(drawable) {
            drawable.draw(canvasId);
        }
        var self = {
            addRef: function () {
                refCount++;
                refChange(uuid, CLASS_NAME, +1);
                return refCount;
            },
            get gl() {
                return gl;
            },
            contextFree: function () {
                gl = void 0;
            },
            contextGain: function (manager) {
                gl = manager.gl;
                startUp.forEach(function (command) {
                    command.execute(gl);
                });
            },
            contextLoss: function () {
                gl = void 0;
            },
            prolog: function () {
                if (gl) {
                    prolog.forEach(function (command) {
                        command.execute(gl);
                    });
                }
                else {
                    console.warn("Unable to execute prolog because WebGLRenderingContext is missing.");
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
            render: function (drawList, unused) {
                drawList.traverse(drawHandler);
            }
        };
        refChange(uuid, CLASS_NAME, +1);
        setStartUpCommands(self);
        setPrologCommands(self);
        return self;
    };
    return renderer;
});
