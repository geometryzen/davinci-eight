define(["require", "exports", '../core/ArrayBuffer', '../dfx/Elements', '../renderers/initWebGL', '../checks/expectArg', '../checks/isDefined', '../checks/isUndefined', '../resources/Texture'], function (require, exports, ArrayBuffer, Elements, initWebGL, expectArg, isDefined, isUndefined, Texture) {
    /**
     * This could become an encapsulated call?
     */
    var DrawElementsCommand = (function () {
        function DrawElementsCommand(mode, count, type, offset) {
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }
        DrawElementsCommand.prototype.execute = function (context) {
            context.drawElements(this.mode, this.count, this.type, this.offset);
        };
        return DrawElementsCommand;
    })();
    var ElementsBlock = (function () {
        function ElementsBlock(indices, attributes, drawCommand) {
            this.indices = indices;
            this.attributes = attributes;
            this.drawCommand = drawCommand;
        }
        return ElementsBlock;
    })();
    var ElementsBlockAttrib = (function () {
        function ElementsBlockAttrib(buffer, size, normalized, stride, offset) {
            this.buffer = buffer;
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
        return ElementsBlockAttrib;
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
            /**
             *
             */
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
                var indexBuffer = self.vertexBuffer();
                indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
                context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                // attributes
                var attributes = {};
                Object.keys(elements.attributes).forEach(function (name) {
                    var buffer = self.vertexBuffer();
                    buffer.bind(context.ARRAY_BUFFER);
                    var vertexAttrib = elements.attributes[name];
                    var data = vertexAttrib.vector.data;
                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
                    context.bindBuffer(context.ARRAY_BUFFER, null);
                    // normalized, stride and offset in future may not be zero.
                    attributes[name] = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
                });
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                var offset = 0; // Later we may set this differently if we reuse buffers.
                var drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, offset);
                tokenMap[token] = new ElementsBlock(indexBuffer, attributes, drawCommand);
                return token;
            },
            setUp: function (token, program, attribMap) {
                var blob = tokenMap[token];
                if (isDefined(blob)) {
                    if (isDefined(program)) {
                        var indices = blob.indices;
                        indices.bind(context.ELEMENT_ARRAY_BUFFER);
                        // FIXME: Probably better to work from the program attributes?
                        Object.keys(blob.attributes).forEach(function (key) {
                            var aName = attribName(key, attribMap);
                            var aLocation = program.attributes[aName];
                            if (isDefined(aLocation)) {
                                var attribute = blob.attributes[key];
                                attribute.buffer.bind(context.ARRAY_BUFFER);
                                aLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                                context.bindBuffer(context.ARRAY_BUFFER, null);
                            }
                            else {
                            }
                        });
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
                    blob.drawCommand.execute(context);
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
                    Object.keys(blob.attributes).forEach(function (key) {
                        var attribute = blob.attributes[key];
                        var buffer = attribute.buffer;
                        self.removeContextUser(buffer);
                    });
                    delete tokenMap[token];
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
