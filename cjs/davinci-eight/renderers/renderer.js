var expectArg = require('../checks/expectArg');
var Color = require('../core/Color');
var DefaultDrawableVisitor = (function () {
    function DefaultDrawableVisitor() {
    }
    DefaultDrawableVisitor.prototype.primitive = function (mesh, program, model) {
        if (mesh.dynamic) {
            mesh.update();
        }
        program.use();
        model.accept(program);
        program.setAttributes(mesh.getAttribData());
        mesh.draw();
        for (var name in program.attributeLocations) {
            program.attributeLocations[name].disable();
        }
    };
    return DefaultDrawableVisitor;
})();
// This visitor is completely stateless so we can create it here.
var drawVisitor = new DefaultDrawableVisitor();
var renderer = function (canvas, parameters) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    parameters = parameters || {};
    var $context = void 0;
    var refCount = 0;
    var autoClear = true;
    var clearColor = Color.fromRGB(0, 0, 0);
    var clearAlpha = 0;
    function drawHandler(drawable) {
        drawable.accept(drawVisitor);
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
        contextFree: function () {
            $context = void 0;
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
        },
        clear: function (mask) {
            if ($context) {
                $context.clear(mask);
            }
        },
        render: function (drawList) {
            if ($context) {
                if (autoClear) {
                    self.clear($context.COLOR_BUFFER_BIT | $context.DEPTH_BUFFER_BIT);
                }
            }
            else {
                console.warn("renderer is unable to clear because WebGLRenderingContext is missing");
            }
            drawList.traverse(drawHandler);
        },
        get COLOR_BUFFER_BIT() {
            return !!$context ? $context.COLOR_BUFFER_BIT : 0;
        },
        get DEPTH_BUFFER_BIT() {
            return !!$context ? $context.DEPTH_BUFFER_BIT : 0;
        },
        get STENCIL_BUFFER_BIT() {
            return !!$context ? $context.STENCIL_BUFFER_BIT : 0;
        }
    };
    return self;
};
module.exports = renderer;
