define(["require", "exports", '../core/ArrayBuffer', '../dfx/Elements', '../renderers/initWebGL', '../checks/expectArg', '../checks/isDefined', '../checks/isUndefined', '../core/Symbolic', '../resources/Texture'], function (require, exports, ArrayBuffer, Elements, initWebGL, expectArg, isDefined, isUndefined, Symbolic, Texture) {
    var ElementBlob = (function () {
        function ElementBlob(elements, indices, positions, drawMode, drawType) {
            this.elements = elements;
            this.indices = indices;
            this.positions = positions;
            this.drawMode = drawMode;
            this.drawType = drawType;
        }
        return ElementBlob;
    })();
    function isDrawMode(mode, context) {
        expectArg('mode', mode).toBeNumber();
        switch (mode) {
            case context.TRIANGLES: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function isBufferUsage(usage, context) {
        expectArg('usage', usage).toBeNumber();
        switch (usage) {
            case context.STATIC_DRAW: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function messageUnrecognizedToken(token) {
        expectArg('token', token).toBeString();
        return token + " is not a recognized token";
    }
    function assertProgram(argName, program) {
        expectArg(argName, program).toBeObject();
    }
    function attribName(name, attribMap) {
        if (isUndefined(attribMap)) {
            return name;
        }
        else {
            var alias = attribMap[name];
            return isDefined(alias) ? alias : name;
        }
    }
    function contextProxy(canvas, attributes) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        var users = [];
        var context;
        var refCount = 1;
        var mirror = true;
        var tokenMap = {};
        var tokenArg = expectArg('token', "");
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
            checkIn: function (elements, mode, usage) {
                expectArg('elements', elements).toSatisfy(elements instanceof Elements, "elements must be an instance of Elements");
                expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    usage = context.STATIC_DRAW;
                }
                var token = Math.random().toString();
                // indices
                var indices = self.vertexBuffer();
                indices.bind(context.ELEMENT_ARRAY_BUFFER);
                context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                // attributes
                var positions = self.vertexBuffer();
                positions.bind(context.ARRAY_BUFFER);
                // TODO: Here we are looking for the attribute in a specific location, but later data-driven.
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(elements.attributes[Symbolic.ATTRIBUTE_POSITION].data), usage);
                context.bindBuffer(context.ARRAY_BUFFER, null);
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                tokenMap[token] = new ElementBlob(elements, indices, positions, mode, context.UNSIGNED_SHORT);
                return token;
            },
            setUp: function (token, program, attribMap) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    if (isDefined(program)) {
                        var indices = blob.indices;
                        indices.bind(context.ELEMENT_ARRAY_BUFFER);
                        var positions = blob.positions;
                        positions.bind(context.ARRAY_BUFFER);
                        // TODO: This hard coded name should vanish.
                        var aName = attribName(Symbolic.ATTRIBUTE_POSITION, attribMap);
                        var posLocation = program.attributes[aName];
                        if (isDefined(posLocation)) {
                            posLocation.vertexPointer(3);
                        }
                        else {
                            throw new Error(aName + " is not a valid program attribute");
                        }
                        context.bindBuffer(context.ARRAY_BUFFER, null);
                    }
                    else {
                        assertProgram('program', program);
                    }
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            draw: function (token) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    var elements = blob.elements;
                    context.drawElements(blob.drawMode, elements.indices.length, blob.drawType, 0);
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            tearDown: function (token, program) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            checkOut: function (token) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    var indices = blob.indices;
                    self.removeContextUser(indices);
                    // Do the same for the attributes.
                    delete tokenMap[token];
                    return blob.elements;
                }
                else {
                    throw new Error(messageUnrecognizedToken(token));
                }
            },
            start: function () {
                context = initWebGL(canvas, attributes);
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                users.forEach(function (user) { user.contextGain(context); });
                return self;
            },
            stop: function () {
                context = void 0;
                users.forEach(function (user) { user.contextFree(); });
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
                if (isDefined(context)) {
                    return context;
                }
                else {
                    console.warn("property context: WebGLRenderingContext is not defined. Either context has been lost or start() not called.");
                    return void 0;
                }
            },
            addRef: function () {
                refCount++;
                // console.log("monitor.addRef() => " + refCount);
                return refCount;
            },
            release: function () {
                refCount--;
                // console.log("monitor.release() => " + refCount);
                if (refCount === 0) {
                    while (users.length > 0) {
                        users.pop().release();
                    }
                }
                return refCount;
            },
            clearColor: function (red, green, blue, alpha) {
                if (context) {
                    return context.clearColor(red, green, blue, alpha);
                }
            },
            clearDepth: function (depth) {
                if (context) {
                    return context.clearDepth(depth);
                }
            },
            drawArrays: function (mode, first, count) {
                if (context) {
                    return context.drawArrays(mode, first, count);
                }
            },
            drawElements: function (mode, count, type, offset) {
                if (context) {
                    return context.drawElements(mode, count, type, offset);
                }
            },
            depthFunc: function (func) {
                if (context) {
                    return context.depthFunc(func);
                }
            },
            enable: function (capability) {
                if (context) {
                    return context.enable(capability);
                }
            },
            texture: function () {
                var texture = new Texture(self);
                self.addContextUser(texture);
                return texture;
            },
            vertexBuffer: function () {
                var vbo = new ArrayBuffer(self);
                self.addContextUser(vbo);
                return vbo;
            },
            get mirror() {
                return mirror;
            },
            set mirror(value) {
                mirror = expectArg('mirror', value).toBeBoolean().value;
            }
        };
        return self;
    }
    return contextProxy;
});
