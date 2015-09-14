define(["require", "exports", '../core/BufferResource', '../dfx/DrawElements', '../renderers/initWebGL', '../checks/expectArg', '../checks/isDefined', '../utils/IUnknownMap', '../utils/RefCount', '../utils/refChange', '../resources/TextureResource', '../utils/uuid4'], function (require, exports, BufferResource, DrawElements, initWebGL, expectArg, isDefined, IUnknownMap, RefCount, refChange, TextureResource, uuid4) {
    var LOGGING_NAME_ELEMENTS_BLOCK = 'ElementsBlock';
    var LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
    var LOGGING_NAME_MESH = 'Mesh';
    var LOGGING_NAME_MANAGER = 'ContextManager';
    function mustBeContext(context, method) {
        if (context) {
            return context;
        }
        else {
            throw new Error(method + ": context: WebGLRenderingContext is not defined. Either context has been lost or start() not called.");
        }
    }
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
        function ElementsBlock(indexBuffer, attributes, drawCommand) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._indexBuffer = indexBuffer;
            this._indexBuffer.addRef();
            this._attributes = attributes;
            this._attributes.addRef();
            this.drawCommand = drawCommand;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, +1);
        }
        Object.defineProperty(ElementsBlock.prototype, "indexBuffer", {
            get: function () {
                this._indexBuffer.addRef();
                return this._indexBuffer;
            },
            enumerable: true,
            configurable: true
        });
        ElementsBlock.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, +1);
            return this._refCount;
        };
        ElementsBlock.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, -1);
            if (this._refCount === 0) {
                this._attributes.release();
                this._indexBuffer.release();
            }
            return this._refCount;
        };
        Object.defineProperty(ElementsBlock.prototype, "attributes", {
            get: function () {
                this._attributes.addRef();
                return this._attributes;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlock;
    })();
    var ElementsBlockAttrib = (function () {
        function ElementsBlockAttrib(buffer, size, normalized, stride, offset) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._buffer = buffer;
            this._buffer.addRef();
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, +1);
        }
        ElementsBlockAttrib.prototype.addRef = function () {
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, +1);
            this._refCount++;
            return this._refCount;
        };
        ElementsBlockAttrib.prototype.release = function () {
            refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, -1);
            this._refCount--;
            if (this._refCount === 0) {
                this._buffer.release();
            }
            return this._refCount;
        };
        Object.defineProperty(ElementsBlockAttrib.prototype, "buffer", {
            get: function () {
                this._buffer.addRef();
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
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
    function messageUnrecognizedMesh(meshUUID) {
        expectArg('meshUUID', meshUUID).toBeString();
        return meshUUID + " is not a recognized mesh uuid";
    }
    function attribKey(aName, aNameToKeyName) {
        if (aNameToKeyName) {
            var key = aNameToKeyName[aName];
            return key ? key : aName;
        }
        else {
            return aName;
        }
    }
    function contextProxy(canvas, attributes) {
        expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        var uuid = uuid4().generate();
        var blocks = new IUnknownMap();
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for context events.
        // Users should automatically add themselves upon construction and remove upon release.
        var users = [];
        function addContextListener(user) {
            expectArg('user', user).toBeObject();
            users.push(user);
            if (context) {
                user.contextGain(context);
            }
        }
        function removeContextListener(user) {
            expectArg('user', user).toBeObject();
            var index = users.indexOf(user);
            if (index >= 0) {
                var removals = users.splice(index, 1);
                removals.forEach(function (user) {
                });
            }
        }
        function meshRemover(blockUUID) {
            return function () {
                if (blocks.exists(blockUUID)) {
                    blocks.remove(blockUUID);
                }
                else {
                    console.warn("[System Error] " + messageUnrecognizedMesh(blockUUID));
                }
            };
        }
        function createDrawElementsMesh(uuid) {
            var refCount = new RefCount(meshRemover(uuid));
            var _program = void 0;
            var mesh = {
                addRef: function () {
                    refChange(uuid, LOGGING_NAME_MESH, +1);
                    return refCount.addRef();
                },
                release: function () {
                    refChange(uuid, LOGGING_NAME_MESH, -1);
                    return refCount.release();
                },
                get uuid() {
                    return uuid;
                },
                bind: function (program, aNameToKeyName) {
                    if (_program !== program) {
                        if (_program) {
                            mesh.unbind();
                        }
                        var block = blocks.get(uuid);
                        if (block) {
                            if (program) {
                                _program = program;
                                _program.addRef();
                                var indexBuffer = block.indexBuffer;
                                indexBuffer.bind();
                                indexBuffer.release();
                                var aNames = Object.keys(program.attributes);
                                var aNamesLength = aNames.length;
                                var aNamesIndex;
                                for (aNamesIndex = 0; aNamesIndex < aNamesLength; aNamesIndex++) {
                                    var aName = aNames[aNamesIndex];
                                    var key = attribKey(aName, aNameToKeyName);
                                    var attributes_1 = block.attributes;
                                    var attribute = attributes_1.get(key);
                                    if (attribute) {
                                        // Associate the attribute buffer with the attribute location.
                                        var buffer = attribute.buffer;
                                        buffer.bind();
                                        var attributeLocation = program.attributes[aName];
                                        attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                                        buffer.unbind();
                                        attributeLocation.enable();
                                        buffer.release();
                                        attribute.release();
                                    }
                                    else {
                                        // The attribute available may not be required by the program.
                                        // TODO: (1) Named programs, (2) disable warning by attribute?
                                        // Do not allow Attribute 0 to be disabled.
                                        console.warn("program attribute " + aName + " is not satisfied by the mesh");
                                    }
                                    attributes_1.release();
                                }
                            }
                            else {
                                expectArg('program', program).toBeObject();
                            }
                            block.release();
                        }
                        else {
                            throw new Error(messageUnrecognizedMesh(uuid));
                        }
                    }
                },
                draw: function () {
                    var block = blocks.get(uuid);
                    if (block) {
                        block.drawCommand.execute(context);
                        block.release();
                    }
                    else {
                        throw new Error(messageUnrecognizedMesh(uuid));
                    }
                },
                unbind: function () {
                    if (_program) {
                        var block = blocks.get(uuid);
                        if (block) {
                            var indexBuffer = block.indexBuffer;
                            indexBuffer.unbind();
                            indexBuffer.release();
                            Object.keys(_program.attributes).forEach(function (aName) {
                                _program.attributes[aName].disable();
                            });
                            block.release();
                        }
                        else {
                            throw new Error(messageUnrecognizedMesh(uuid));
                        }
                        _program.release();
                        // Important! The existence of _program indicates the binding state.
                        _program = void 0;
                    }
                }
            };
            refChange(uuid, LOGGING_NAME_MESH, +1);
            return mesh;
        }
        var context;
        var refCount = 1;
        var mirror = false;
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
        var monitor = {
            /**
             *
             */
            createDrawElementsMesh: function (elements, mode, usage) {
                expectArg('elements', elements).toSatisfy(elements instanceof DrawElements, "elements must be an instance of DrawElements");
                expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    usage = context.STATIC_DRAW;
                }
                var token = createDrawElementsMesh(uuid4().generate());
                var indexBuffer = monitor.createElementArrayBuffer();
                indexBuffer.bind();
                context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                indexBuffer.unbind();
                var attributes = new IUnknownMap();
                var names = Object.keys(elements.attributes);
                var namesLength = names.length;
                var i;
                for (i = 0; i < namesLength; i++) {
                    var name_1 = names[i];
                    var buffer = monitor.createArrayBuffer();
                    buffer.bind();
                    var vertexAttrib = elements.attributes[name_1];
                    var data = vertexAttrib.values.data;
                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
                    var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
                    attributes.put(name_1, attribute);
                    attribute.release();
                    buffer.unbind();
                    buffer.release();
                }
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                var drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, 0);
                var block = new ElementsBlock(indexBuffer, attributes, drawCommand);
                blocks.put(token.uuid, block);
                block.release();
                attributes.release();
                indexBuffer.release();
                return token;
            },
            start: function () {
                context = initWebGL(canvas, attributes);
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                users.forEach(function (user) { user.contextGain(context); });
                return monitor;
            },
            stop: function () {
                context = void 0;
                users.forEach(function (user) { user.contextFree(); });
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
                return monitor;
            },
            addContextListener: function (user) {
                addContextListener(user);
                return monitor;
            },
            removeContextListener: function (user) {
                removeContextListener(user);
                return monitor;
            },
            get context() {
                if (context) {
                    return context;
                }
                else {
                    console.warn("property context: WebGLRenderingContext is not defined. Either context has been lost or start() not called.");
                    return void 0;
                }
            },
            addRef: function () {
                refChange(uuid, LOGGING_NAME_MANAGER, +1);
                refCount++;
                return refCount;
            },
            release: function () {
                refChange(uuid, LOGGING_NAME_MANAGER, -1);
                refCount--;
                if (refCount === 0) {
                    blocks.release();
                    while (users.length > 0) {
                        var user = users.pop();
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
            createArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern.
                return new BufferResource(monitor, mustBeContext(context, 'createArrayBuffer()').ARRAY_BUFFER);
            },
            createElementArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern.
                return new BufferResource(monitor, mustBeContext(context, 'createElementArrayBuffer()').ELEMENT_ARRAY_BUFFER);
            },
            createTexture2D: function () {
                // TODO: Replace with functional constructor pattern.
                return new TextureResource(monitor, mustBeContext(context, 'createTexture2D()').TEXTURE_2D);
            },
            createTextureCubeMap: function () {
                // TODO: Replace with functional constructor pattern.
                return new TextureResource(monitor, mustBeContext(context, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
            },
            get mirror() {
                return mirror;
            },
            set mirror(value) {
                mirror = expectArg('mirror', value).toBeBoolean().value;
            }
        };
        refChange(uuid, LOGGING_NAME_MANAGER, +1);
        return monitor;
    }
    return contextProxy;
});
