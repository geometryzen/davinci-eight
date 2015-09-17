var BufferResource = require('../core/BufferResource');
var DrawElements = require('../dfx/DrawElements');
var expectArg = require('../checks/expectArg');
var initWebGL = require('../renderers/initWebGL');
var isDefined = require('../checks/isDefined');
var isNumber = require('../checks/isNumber');
var mustBeInteger = require('../checks/mustBeInteger');
var RefCount = require('../utils/RefCount');
var refChange = require('../utils/refChange');
var Simplex = require('../dfx/Simplex');
var StringIUnknownMap = require('../utils/StringIUnknownMap');
var TextureResource = require('../resources/TextureResource');
var uuid4 = require('../utils/uuid4');
var LOGGING_NAME_ELEMENTS_BLOCK = 'ElementsBlock';
var LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
var LOGGING_NAME_MESH = 'Mesh';
var LOGGING_NAME_KAHUNA = 'ContextKahuna';
function webglFunctionalConstructorContextBuilder() {
    // The following string represents how this API is exposed.
    return "webgl functional constructor";
}
function mustBeContext(gl, method) {
    if (gl) {
        return gl;
    }
    else {
        throw new Error(method + ": gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
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
    DrawElementsCommand.prototype.execute = function (gl) {
        gl.drawElements(this.mode, this.count, this.type, this.offset);
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
/**
 *
 */
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
// TODO: If mode provided, check consistent with elements.k.
// expectArg('mode', mode).toSatisfy(isDrawMode(mode, gl), "mode must be one of TRIANGLES, ...");
function drawMode(k, mode, gl) {
    switch (k) {
        case Simplex.K_FOR_TRIANGLE: {
            return gl.TRIANGLES;
        }
        case Simplex.K_FOR_LINE_SEGMENT: {
            return gl.LINES;
        }
        case Simplex.K_FOR_POINT: {
            return gl.POINTS;
        }
        case Simplex.K_FOR_EMPTY: {
            return void 0;
        }
        default: {
            throw new Error("Unexpected k-simplex dimension, k => " + k);
        }
    }
}
function isDrawMode(mode, gl) {
    if (!isNumber(mode)) {
        expectArg('mode', mode).toBeNumber();
    }
    switch (mode) {
        case gl.TRIANGLES: {
            return true;
        }
        case gl.LINES: {
            return true;
        }
        case gl.POINTS: {
            return true;
        }
        default: {
            return false;
        }
    }
}
function isBufferUsage(usage, gl) {
    expectArg('usage', usage).toBeNumber();
    switch (usage) {
        case gl.STATIC_DRAW: {
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
// FIXME: Use this function pair to replace BEGIN..END
/**
 *
 */
function bindProgramAttribLocations(program, block, aNameToKeyName) {
    // FIXME: This is where we get the IProgram attributes property.
    // FIXME: Can we invert this?
    // What are we offering to the program:
    // block.attributes (reference counted)
    // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
    // in order to get the name -> index correct.
    // Then attribute setting shoul go much faster
    var attribLocations = program.attributes;
    if (attribLocations) {
        var aNames = Object.keys(attribLocations);
        var aNamesLength = aNames.length;
        var i;
        for (i = 0; i < aNamesLength; i++) {
            var aName = aNames[i];
            var key = attribKey(aName, aNameToKeyName);
            var attributes = block.attributes;
            var attribute = attributes.get(key);
            if (attribute) {
                // Associate the attribute buffer with the attribute location.
                var buffer = attribute.buffer;
                buffer.bind();
                var attributeLocation = attribLocations[aName];
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
            attributes.release();
        }
    }
    else {
        console.warn("unbindProgramAttribLocations: program.attributes is falsey.");
    }
}
function unbindProgramAttribLocations(program) {
    // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
    var attribLocations = program.attributes;
    if (attribLocations) {
        Object.keys(attribLocations).forEach(function (aName) {
            attribLocations[aName].disable();
        });
    }
    else {
        console.warn("unbindProgramAttribLocations: program.attributes is falsey.");
    }
}
function webgl(canvas, canvasId, attributes) {
    if (canvasId === void 0) { canvasId = 0; }
    expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement @ webgl function");
    mustBeInteger('canvasId', canvasId, webglFunctionalConstructorContextBuilder);
    var uuid = uuid4().generate();
    var blocks = new StringIUnknownMap();
    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    var users = [];
    function addContextListener(user) {
        expectArg('user', user).toBeObject();
        users.push(user);
        if (gl) {
            user.contextGain(kahuna);
        }
    }
    function removeContextListener(user) {
        expectArg('user', user).toBeObject();
        var index = users.indexOf(user);
        if (index >= 0) {
            var removals = users.splice(index, 1);
            removals.forEach(function (user) {
                // What's going on here?
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
                            bindProgramAttribLocations(_program, block, aNameToKeyName);
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
                    block.drawCommand.execute(gl);
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
                        unbindProgramAttribLocations(_program);
                        block.release();
                    }
                    else {
                        throw new Error(messageUnrecognizedMesh(uuid));
                    }
                    // We bumped up the reference count during bind. Now we are done.
                    _program.release();
                    // Important! The existence of _program indicates the binding state.
                    _program = void 0;
                }
            }
        };
        refChange(uuid, LOGGING_NAME_MESH, +1);
        return mesh;
    }
    // FIXME Rename to gl
    var gl;
    var refCount = 1;
    var mirror = false;
    var tokenArg = expectArg('token', "");
    var webGLContextLost = function (event) {
        event.preventDefault();
        gl = void 0;
        users.forEach(function (user) {
            user.contextLoss(canvasId);
        });
    };
    var webGLContextRestored = function (event) {
        event.preventDefault();
        gl = initWebGL(canvas, attributes);
        users.forEach(function (user) {
            user.contextGain(kahuna);
        });
    };
    var kahuna = {
        get canvasId() {
            return canvasId;
        },
        /**
         *
         */
        createDrawElementsMesh: function (elements, mode, usage) {
            expectArg('elements', elements).toSatisfy(elements instanceof DrawElements, "elements must be an instance of DrawElements");
            mode = drawMode(elements.k, mode, gl);
            if (!isDefined(mode)) {
                // An empty simplex (k = -1 or vertices.length = k + 1 = 0) begets
                // something that can't be drawn (no mode) and it is invisible anyway.
                // In such a case we choose not to allocate any buffers. What would be the usage?
                return void 0;
            }
            if (isDefined(usage)) {
                expectArg('usage', usage).toSatisfy(isBufferUsage(usage, gl), "usage must be on of STATIC_DRAW, ...");
            }
            else {
                usage = gl.STATIC_DRAW;
            }
            var mesh = createDrawElementsMesh(uuid4().generate());
            var indexBuffer = kahuna.createElementArrayBuffer();
            indexBuffer.bind();
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
            indexBuffer.unbind();
            var attributes = new StringIUnknownMap();
            var names = Object.keys(elements.attributes);
            var namesLength = names.length;
            var i;
            for (i = 0; i < namesLength; i++) {
                var name_1 = names[i];
                var buffer = kahuna.createArrayBuffer();
                buffer.bind();
                var vertexAttrib = elements.attributes[name_1];
                var data = vertexAttrib.values.data;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
                var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
                attributes.put(name_1, attribute);
                attribute.release();
                buffer.unbind();
                buffer.release();
            }
            // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
            // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
            switch (elements.k) {
            }
            var drawCommand = new DrawElementsCommand(mode, elements.indices.length, gl.UNSIGNED_SHORT, 0);
            var block = new ElementsBlock(indexBuffer, attributes, drawCommand);
            blocks.put(mesh.uuid, block);
            block.release();
            attributes.release();
            indexBuffer.release();
            return mesh;
        },
        start: function () {
            gl = initWebGL(canvas, attributes);
            canvas.addEventListener('webglcontextlost', webGLContextLost, false);
            canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
            users.forEach(function (user) { user.contextGain(kahuna); });
        },
        stop: function () {
            gl = void 0;
            users.forEach(function (user) { user.contextFree(canvasId); });
            canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
            canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
        },
        addContextListener: function (user) {
            addContextListener(user);
        },
        removeContextListener: function (user) {
            removeContextListener(user);
        },
        get gl() {
            if (gl) {
                return gl;
            }
            else {
                console.warn("property gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
                return void 0;
            }
        },
        addRef: function () {
            refCount++;
            refChange(uuid, LOGGING_NAME_KAHUNA, +1);
            return refCount;
        },
        release: function () {
            refCount--;
            refChange(uuid, LOGGING_NAME_KAHUNA, -1);
            if (refCount === 0) {
                blocks.release();
                while (users.length > 0) {
                    var user = users.pop();
                }
            }
            return refCount;
        },
        clearColor: function (red, green, blue, alpha) {
            if (gl) {
                return gl.clearColor(red, green, blue, alpha);
            }
        },
        clearDepth: function (depth) {
            if (gl) {
                return gl.clearDepth(depth);
            }
        },
        drawArrays: function (mode, first, count) {
            if (gl) {
                return gl.drawArrays(mode, first, count);
            }
        },
        drawElements: function (mode, count, type, offset) {
            if (gl) {
                return gl.drawElements(mode, count, type, offset);
            }
        },
        depthFunc: function (func) {
            if (gl) {
                return gl.depthFunc(func);
            }
        },
        enable: function (capability) {
            if (gl) {
                return gl.enable(capability);
            }
        },
        createArrayBuffer: function () {
            // TODO: Replace with functional constructor pattern.
            return new BufferResource(kahuna, mustBeContext(gl, 'createArrayBuffer()').ARRAY_BUFFER);
        },
        createElementArrayBuffer: function () {
            // TODO: Replace with functional constructor pattern.
            return new BufferResource(kahuna, mustBeContext(gl, 'createElementArrayBuffer()').ELEMENT_ARRAY_BUFFER);
        },
        createTexture2D: function () {
            // TODO: Replace with functional constructor pattern.
            // FIXME Does this mean that Texture only has one ContextMonitor?
            return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
        },
        createTextureCubeMap: function () {
            // TODO: Replace with functional constructor pattern.
            return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
        },
        get mirror() {
            return mirror;
        },
        set mirror(value) {
            mirror = expectArg('mirror', value).toBeBoolean().value;
        }
    };
    refChange(uuid, LOGGING_NAME_KAHUNA, +1);
    return kahuna;
}
module.exports = webgl;
