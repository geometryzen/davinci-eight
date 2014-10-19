define(["require", "exports", 'eight/core'], function(require, exports, core) {
    var webGLRenderer = function (parameters) {
        console.log('davinci-eight', core.VERSION);

        parameters = parameters || {};

        var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement('canvas');
        var alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        var depth = parameters.depth !== undefined ? parameters.depth : true;
        var stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        var antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        var premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        var preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

        var gl;

        var setViewport = function (x, y, width, height) {
            if (gl) {
                gl.viewport(x, y, width, height);
            }
        };

        function initGL() {
            try  {
                var attributes = {
                    'alpha': alpha,
                    'depth': depth,
                    'stencil': stencil,
                    'antialias': antialias,
                    'premultipliedAlpha': premultipliedAlpha,
                    'preserveDrawingBuffer': preserveDrawingBuffer
                };

                gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);

                if (gl === null) {
                    throw 'Error creating WebGL context.';
                }
            } catch (e) {
                console.error(e);
            }
        }

        var that = {
            get canvas() {
                return canvas;
            },
            get context() {
                return gl;
            },
            onContextGain: function (context) {
                gl = context;
                gl.clearColor(32 / 256, 32 / 256, 32 / 256, 1.0);
                gl.enable(gl.DEPTH_TEST);
            },
            onContextLoss: function () {
            },
            clearColor: function (r, g, b, a) {
                if (gl) {
                    gl.clearColor(r, g, b, a);
                }
            },
            render: function (scene, camera) {
                if (gl) {
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var children = scene.children;
                    for (var i = 0, length = children.length; i < length; i++) {
                        children[i].draw(camera.projectionMatrix);
                    }
                }
            },
            viewport: function (x, y, width, height) {
                if (gl) {
                    gl.viewport(x, y, width, height);
                }
            },
            setSize: function (width, height, updateStyle) {
                canvas.width = width; // * devicePixelRatio;
                canvas.height = height; // * devicePixelRatio;

                if (updateStyle !== false) {
                    canvas.style.width = width + 'px';
                    canvas.style.height = height + 'px';
                }

                setViewport(0, 0, width, height);
            }
        };

        initGL();

        return that;
    };

    
    return webGLRenderer;
});
