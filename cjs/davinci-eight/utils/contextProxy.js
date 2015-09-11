var ArrayBuffer = require('../core/ArrayBuffer');
var Elements = require('../dfx/Elements');
var initWebGL = require('../renderers/initWebGL');
var expectArg = require('../checks/expectArg');
var isDefined = require('../checks/isDefined');
var isUndefined = require('../checks/isUndefined');
var RefCount = require('../utils/RefCount');
var refChange = require('../utils/refChange');
var Texture = require('../resources/Texture');
var uuid4 = require('../utils/uuid4');
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
        Object.keys(attributes).forEach(function (key) {
            attributes[key].addRef();
        });
        this.drawCommand = drawCommand;
        refChange(this._uuid, +1, 'ElementsBlock');
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
        refChange(this._uuid, +1, 'ElementsBlock');
        this._refCount++;
        return this._refCount;
    };
    ElementsBlock.prototype.release = function () {
        refChange(this._uuid, -1, 'ElementsBlock');
        this._refCount--;
        if (this._refCount === 0) {
            var attributes = this._attributes;
            Object.keys(attributes).forEach(function (key) {
                attributes[key].release();
            });
            this._attributes = void 0;
            this._indexBuffer.release();
            this._indexBuffer = void 0;
            this.drawCommand = void 0;
            this._uuid = void 0;
            var refCount = this._refCount;
            this._refCount = 0;
            return refCount;
        }
        else {
            return this._refCount;
        }
    };
    Object.defineProperty(ElementsBlock.prototype, "attributes", {
        get: function () {
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
        refChange(this._uuid, +1, 'ElementsBlockAttrib');
    }
    ElementsBlockAttrib.prototype.addRef = function () {
        refChange(this._uuid, +1, 'ElementsBlockAttrib');
        this._refCount++;
        return this._refCount;
    };
    ElementsBlockAttrib.prototype.release = function () {
        refChange(this._uuid, -1, 'ElementsBlockAttrib');
        this._refCount--;
        if (this._refCount === 0) {
            this._buffer.release();
            this._buffer = void 0;
            this.size = void 0;
            this.normalized = void 0;
            this.stride = void 0;
            this.offset = void 0;
            this._uuid = void 0;
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
function messageUnrecognizedToken(token) {
    expectArg('token', token).toBeString();
    return token + " is not a recognized token";
}
function assertProgram(argName, program) {
    expectArg(argName, program).toBeObject();
}
function attribKey(aName, aNameToKeyName) {
    if (isUndefined(aNameToKeyName)) {
        return aName;
    }
    else {
        var key = aNameToKeyName[aName];
        return isDefined(key) ? key : aName;
    }
}
function contextProxy(canvas, attributes) {
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
    var uuid = uuid4().generate();
    var tokenMap = {};
    var users = [];
    function addContextUser(user) {
        expectArg('user', user).toBeObject();
        users.push(user);
        user.addRef();
        if (context) {
            user.contextGain(context);
        }
    }
    function removeContextUser(user) {
        expectArg('user', user).toBeObject();
        var index = users.indexOf(user);
        if (index >= 0) {
            var removals = users.splice(index, 1);
            removals.forEach(function (user) {
                user.release();
            });
        }
    }
    function drawTokenDelete(uuid) {
        return function () {
            var blob = tokenMap[uuid];
            if (isDefined(blob)) {
                var indexBuffer = blob.indexBuffer;
                removeContextUser(indexBuffer);
                indexBuffer.release();
                indexBuffer = void 0;
                Object.keys(blob.attributes).forEach(function (key) {
                    var attribute = blob.attributes[key];
                    var buffer = attribute.buffer;
                    try {
                        removeContextUser(buffer);
                    }
                    finally {
                        buffer.release();
                        buffer = void 0;
                    }
                });
                blob.release();
                delete tokenMap[uuid];
            }
            else {
                throw new Error(messageUnrecognizedToken(uuid));
            }
        };
    }
    function drawToken(uuid) {
        var refCount = new RefCount(drawTokenDelete(uuid));
        var _program = void 0;
        var self = {
            addRef: function () {
                refChange(uuid, +1, 'Mesh');
                return refCount.addRef();
            },
            release: function () {
                refChange(uuid, -1, 'Mesh');
                return refCount.release();
            },
            get uuid() {
                return uuid;
            },
            bind: function (program, aNameToKeyName) {
                if (_program !== program) {
                    if (_program) {
                        self.unbind();
                    }
                    var blob = tokenMap[uuid];
                    if (isDefined(blob)) {
                        if (isDefined(program)) {
                            var indexBuffer = blob.indexBuffer;
                            indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
                            indexBuffer.release();
                            indexBuffer = void 0;
                            // FIXME: We're doing a lot of string-based lookup!
                            Object.keys(program.attributes).forEach(function (aName) {
                                var key = attribKey(aName, aNameToKeyName);
                                var attribute = blob.attributes[key];
                                if (isDefined(attribute)) {
                                    // Associate the attribute buffer with the attribute location.
                                    var buffer = attribute.buffer;
                                    try {
                                        buffer.bind(context.ARRAY_BUFFER);
                                        try {
                                            var attributeLocation = program.attributes[aName];
                                            attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                                            attributeLocation.enable();
                                        }
                                        finally {
                                            context.bindBuffer(context.ARRAY_BUFFER, null);
                                        }
                                    }
                                    finally {
                                        buffer.release();
                                        buffer = void 0;
                                    }
                                }
                                else {
                                    // The attribute available may not be required by the program.
                                    // TODO: (1) Named programs, (2) disable warning by attribute?
                                    // Do not allow Attribute 0 to be disabled.
                                    console.warn("program attribute " + aName + " is not satisfied by the token");
                                }
                            });
                        }
                        else {
                            assertProgram('program', program);
                        }
                    }
                    else {
                        throw new Error(messageUnrecognizedToken(uuid));
                    }
                    _program = program;
                    _program.addRef();
                }
            },
            draw: function () {
                var blob = tokenMap[uuid];
                if (isDefined(blob)) {
                    blob.drawCommand.execute(context);
                }
                else {
                    throw new Error(messageUnrecognizedToken(uuid));
                }
            },
            unbind: function () {
                if (_program) {
                    var blob = tokenMap[uuid];
                    if (isDefined(blob)) {
                        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                        Object.keys(_program.attributes).forEach(function (aName) {
                            var aLocation = _program.attributes[aName];
                            // Disable the attribute location.
                            aLocation.disable();
                        });
                    }
                    else {
                        throw new Error(messageUnrecognizedToken(uuid));
                    }
                    _program.release();
                    _program = void 0;
                }
            }
        };
        refChange(uuid, +1, 'Mesh');
        return self;
    }
    var context;
    var refCount = 1;
    var mirror = true;
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
        createMesh: function (elements, mode, usage) {
            expectArg('elements', elements).toSatisfy(elements instanceof Elements, "elements must be an instance of Elements");
            expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
            if (isDefined(usage)) {
                expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
            }
            else {
                usage = context.STATIC_DRAW;
            }
            var token = drawToken(uuid4().generate());
            var indexBuffer = self.vertexBuffer();
            try {
                indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
                context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
                // attributes
                var attributes_1 = {};
                try {
                    Object.keys(elements.attributes).forEach(function (name) {
                        var buffer = self.vertexBuffer();
                        try {
                            buffer.bind(context.ARRAY_BUFFER);
                            try {
                                var vertexAttrib = elements.attributes[name];
                                var data = vertexAttrib.vector.data;
                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
                                attributes_1[name] = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
                            }
                            finally {
                                context.bindBuffer(context.ARRAY_BUFFER, null);
                            }
                        }
                        finally {
                            buffer.release();
                            buffer = void 0;
                        }
                    });
                    // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                    // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                    var drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, 0);
                    tokenMap[token.uuid] = new ElementsBlock(indexBuffer, attributes_1, drawCommand);
                }
                finally {
                    Object.keys(attributes_1).forEach(function (key) {
                        var attribute = attributes_1[key];
                        attribute.release();
                    });
                }
            }
            finally {
                indexBuffer.release();
                indexBuffer = void 0;
            }
            return token;
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
            addContextUser(user);
            return self;
        },
        removeContextUser: function (user) {
            removeContextUser(user);
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
            refChange(uuid, +1, 'RenderingContextMonitor');
            refCount++;
            return refCount;
        },
        release: function () {
            refChange(uuid, -1, 'RenderingContextMonitor');
            refCount--;
            if (refCount === 0) {
                while (users.length > 0) {
                    var user = users.pop();
                    user.release();
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
    refChange(uuid, +1, 'RenderingContextMonitor');
    return self;
}
module.exports = contextProxy;
