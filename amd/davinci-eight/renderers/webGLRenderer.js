define(["require", "exports"], function (require, exports) {
    var FrameworkDrawContext = (function () {
        function FrameworkDrawContext() {
            this.startTime = Date.now();
            this.frameTime = 0;
        }
        FrameworkDrawContext.prototype.time = function () {
            return this.frameTime;
        };
        FrameworkDrawContext.prototype.frameBegin = function () {
        };
        FrameworkDrawContext.prototype.frameEnd = function () {
            this.frameTime = Date.now() - this.startTime;
        };
        return FrameworkDrawContext;
    })();
    function initWebGL(canvas, attributes) {
        var context;
        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            context = (canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
        }
        catch (e) {
        }
        if (context) {
            return context;
        }
        else {
            throw new Error("Unable to initialize WebGL. Your browser may not support it.");
        }
    }
    var renderer = function (parameters) {
        parameters = parameters || {};
        var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
        var alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        var depth = parameters.depth !== undefined ? parameters.depth : true;
        var stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        var antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        var premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        var preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
        var drawContext = new FrameworkDrawContext();
        var context;
        var contextGainId;
        var devicePixelRatio = 1;
        var autoClearColor = true;
        var autoClearDepth = true;
        function setViewport(x, y, width, height) {
            if (context) {
                context.viewport(x * devicePixelRatio, y * devicePixelRatio, width * devicePixelRatio, height * devicePixelRatio);
            }
        }
        var publicAPI = {
            get canvas() { return canvas; },
            get context() { return context; },
            contextFree: function () {
                context = void 0;
            },
            contextGain: function (contextArg, contextGainId) {
                context = contextArg;
                context.clearColor(32 / 256, 32 / 256, 32 / 256, 1.0);
                context.enable(context.DEPTH_TEST);
            },
            contextLoss: function () {
            },
            hasContext: function () {
                return !!context;
            },
            clearColor: function (r, g, b, a) {
                if (context) {
                    context.clearColor(r, g, b, a);
                }
            },
            render: function (scene, ambientUniforms) {
                drawContext.frameBegin();
                context.clearColor(0.8, 0.8, 0.8, 1.0);
                context.enable(context.DEPTH_TEST);
                context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
                var drawGroups = {};
                if (!scene.hasContext()) {
                    scene.contextGain(context, contextGainId);
                }
                var programLoaded;
                var time = drawContext.time();
                var drawHandler = function (drawable, index) {
                    if (!programLoaded) {
                        drawable.useProgram(context);
                        programLoaded = true;
                    }
                    drawable.draw(context, time, ambientUniforms);
                };
                for (var drawGroupName in scene.drawGroups) {
                    programLoaded = false;
                    scene.drawGroups[drawGroupName].forEach(drawHandler);
                }
            },
            setViewport: setViewport,
            setSize: function (width, height, updateStyle) {
                canvas.width = width * devicePixelRatio;
                canvas.height = height * devicePixelRatio;
                if (updateStyle !== false) {
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                }
                setViewport(0, 0, width, height);
            }
        };
        var attributes = {
            'alpha': alpha,
            'depth': depth,
            'stencil': stencil,
            'antialias': antialias,
            'premultipliedAlpha': premultipliedAlpha,
            'preserveDrawingBuffer': preserveDrawingBuffer
        };
        context = initWebGL(canvas, attributes);
        contextGainId = Math.random().toString();
        setViewport(0, 0, canvas.width, canvas.height);
        return publicAPI;
    };
    return renderer;
});
