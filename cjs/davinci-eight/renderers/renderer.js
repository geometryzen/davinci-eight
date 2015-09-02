var expectArg = require('../checks/expectArg');
var Color = require('../core/Color');
var renderer = function (canvas, parameters) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    parameters = parameters || {};
    var $context = void 0;
    var refCount = 0;
    var autoClear = true;
    var clearColor = Color.fromRGB(0, 0, 0);
    var clearAlpha = 0;
    function drawHandler(drawable) {
        drawable.draw();
    }
    var self = {
        get canvas() { return canvas; },
        get context() { return $context; },
        addRef: function () {
            refCount++;
            // console.log("renderer.addRef() => " + refCount);
        },
        release: function () {
            refCount--;
            // console.log("renderer.release() => " + refCount);
            if (refCount === 0) {
                $context = void 0;
            }
        },
        contextGain: function (context) {
            //let attributes: WebGLContextAttributes = context.getContextAttributes();
            //console.log(context.getParameter(context.VERSION));
            //console.log("alpha                 => " + attributes.alpha);
            //console.log("antialias             => " + attributes.antialias);
            //console.log("depth                 => " + attributes.depth);
            //console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha);
            //console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer);
            //console.log("stencil               => " + attributes.stencil);
            $context = context;
            context.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearAlpha);
            context.clearDepth(1.0);
            context.enable($context.DEPTH_TEST);
            context.depthFunc($context.LEQUAL);
            context.viewport(0, 0, canvas.width, canvas.height);
        },
        contextLoss: function () {
            $context = void 0;
        },
        hasContext: function () {
            return !!$context;
        },
        get autoClear() {
            return autoClear;
        },
        set autoClear(value) {
            autoClear = expectArg('autoClear', value).toBeBoolean().value;
        },
        clearColor: function (red, green, blue, alpha) {
            clearColor.red = expectArg('red', red).toBeNumber().value;
            clearColor.green = expectArg('green', green).toBeNumber().value;
            clearColor.blue = expectArg('blue', blue).toBeNumber().value;
            clearAlpha = expectArg('alpha', alpha).toBeNumber().value;
            if ($context) {
                $context.clearColor(red, green, blue, alpha);
            }
            return self;
        },
        render: function (scene) {
            var program;
            if ($context) {
                if (autoClear) {
                    $context.clear($context.COLOR_BUFFER_BIT | $context.DEPTH_BUFFER_BIT);
                }
                scene.traverse(drawHandler);
            }
            else {
                console.warn("renderer is unable to render because WebGLRenderingContext is missing");
            }
        },
    };
    return self;
};
module.exports = renderer;
