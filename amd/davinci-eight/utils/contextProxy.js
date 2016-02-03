var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/BufferResource', '../core/DrawMode', '../core', '../checks/expectArg', '../renderers/initWebGL', '../checks/isDefined', '../checks/isUndefined', '../checks/mustBeArray', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../utils/randumbInteger', '../utils/refChange', '../utils/Shareable', '../collections/StringIUnknownMap', '../resources/TextureResource', '../utils/uuid4'], function (require, exports, BufferResource_1, DrawMode_1, core_1, expectArg_1, initWebGL_1, isDefined_1, isUndefined_1, mustBeArray_1, mustBeInteger_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, randumbInteger_1, refChange_1, Shareable_1, StringIUnknownMap_1, TextureResource_1, uuid4_1) {
    var LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
    var LOGGING_NAME_MESH = 'Drawable';
    var LOGGING_NAME_KERNEL = 'WebGLRenderer';
    function mustBeContext(gl, method) {
        if (gl) {
            return gl;
        }
        else {
            throw new Error(method + ": gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
        }
    }
    var DrawElementsCommand = (function () {
        function DrawElementsCommand(mode, count, type, offset) {
            mustBeInteger_1.default('mode', mode);
            mustBeInteger_1.default('count', count);
            mustBeInteger_1.default('type', type);
            mustBeInteger_1.default('offset', offset);
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }
        DrawElementsCommand.prototype.execute = function (gl) {
            if (isDefined_1.default(gl)) {
                switch (this.mode) {
                    case DrawMode_1.default.TRIANGLE_STRIP:
                        gl.drawElements(gl.TRIANGLE_STRIP, this.count, this.type, this.offset);
                        break;
                    case DrawMode_1.default.TRIANGLE_FAN:
                        gl.drawElements(gl.TRIANGLE_FAN, this.count, this.type, this.offset);
                        break;
                    case DrawMode_1.default.TRIANGLES:
                        gl.drawElements(gl.TRIANGLES, this.count, this.type, this.offset);
                        break;
                    case DrawMode_1.default.LINE_STRIP:
                        gl.drawElements(gl.LINE_STRIP, this.count, this.type, this.offset);
                        break;
                    case DrawMode_1.default.LINE_LOOP:
                        gl.drawElements(gl.LINE_LOOP, this.count, this.type, this.offset);
                        break;
                    case DrawMode_1.default.LINES:
                        gl.drawElements(gl.LINES, this.count, this.type, this.offset);
                        break;
                    case DrawMode_1.default.POINTS:
                        gl.drawElements(gl.POINTS, this.count, this.type, this.offset);
                        break;
                    default:
                        throw new Error("mode: " + this.mode);
                }
            }
        };
        return DrawElementsCommand;
    })();
    var ElementsBlock = (function (_super) {
        __extends(ElementsBlock, _super);
        function ElementsBlock(indexBuffer, attributes, drawCommand) {
            _super.call(this, 'ElementsBlock');
            this._indexBuffer = indexBuffer;
            this._indexBuffer.addRef();
            this._attributes = attributes;
            this._attributes.addRef();
            this.drawCommand = drawCommand;
        }
        ElementsBlock.prototype.destructor = function () {
            this._attributes.release();
            this._attributes = void 0;
            this._indexBuffer.release();
            this._indexBuffer = void 0;
            _super.prototype.destructor.call(this);
        };
        ElementsBlock.prototype.bind = function () {
            this._indexBuffer.bind();
        };
        ElementsBlock.prototype.unbind = function () {
            this._indexBuffer.unbind();
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
    })(Shareable_1.default);
    var ElementsBlockAttrib = (function (_super) {
        __extends(ElementsBlockAttrib, _super);
        function ElementsBlockAttrib(buffer, size, normalized, stride, offset) {
            _super.call(this, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE);
            this._buffer = buffer;
            this._buffer.addRef();
            this.size = size;
            this.normalized = normalized;
            this.stride = stride;
            this.offset = offset;
        }
        ElementsBlockAttrib.prototype.destructor = function () {
            this._buffer.release();
            this._buffer = void 0;
            this.size = void 0;
            this.normalized = void 0;
            this.stride = void 0;
            this.offset = void 0;
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
    })(Shareable_1.default);
    function isBufferUsage(usage) {
        mustBeNumber_1.default('usage', usage);
        switch (usage) {
            case WebGLRenderingContext.STATIC_DRAW: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    function messageUnrecognizedMesh(uuid) {
        mustBeString_1.default('uuid', uuid);
        return uuid + " is not a recognized mesh uuid";
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
    function bindProgramAttribLocations(program, block, aNameToKeyName, canvasId) {
        var attribLocations = program.attributes(canvasId);
        if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                var aName = aNames[i];
                var key = attribKey(aName, aNameToKeyName);
                var attributes = block.attributes;
                var attribute = attributes.getWeakRef(key);
                if (attribute) {
                    var buffer = attribute.buffer;
                    buffer.bind();
                    var attributeLocation = attribLocations[aName];
                    attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                    buffer.unbind();
                    attributeLocation.enable();
                    buffer.release();
                }
                else {
                    console.warn("program attribute " + aName + " is not satisfied by the mesh");
                }
                attributes.release();
            }
        }
        else {
            console.warn("program.attributes is falsey.");
        }
    }
    function unbindProgramAttribLocations(program, canvasId) {
        var attribLocations = program.attributes(canvasId);
        if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].disable();
            }
        }
        else {
            console.warn("program.attributes is falsey.");
        }
    }
    var BufferGeometry = (function (_super) {
        __extends(BufferGeometry, _super);
        function BufferGeometry(canvasId, gl, blocks) {
            _super.call(this, 'BufferGeometry');
            this.canvasId = canvasId;
            this._blocks = blocks;
            this._blocks.addRef();
            this.gl = gl;
        }
        BufferGeometry.prototype.destructor = function () {
            this._blocks.release();
            this._blocks = void 0;
            this.gl = void 0;
            _super.prototype.destructor.call(this);
        };
        BufferGeometry.prototype.bind = function (program, aNameToKeyName) {
            if (this._program !== program) {
                if (this._program) {
                    this.unbind();
                }
                var block = this._blocks.getWeakRef(this.uuid);
                if (block) {
                    if (program) {
                        this._program = program;
                        this._program.addRef();
                        block.bind();
                        bindProgramAttribLocations(this._program, block, aNameToKeyName, this.canvasId);
                    }
                    else {
                        mustBeObject_1.default('program', program);
                    }
                }
                else {
                    throw new Error(messageUnrecognizedMesh(this.uuid));
                }
            }
        };
        BufferGeometry.prototype.draw = function () {
            var block = this._blocks.getWeakRef(this.uuid);
            if (block) {
                block.drawCommand.execute(this.gl);
            }
            else {
                throw new Error(messageUnrecognizedMesh(this.uuid));
            }
        };
        BufferGeometry.prototype.unbind = function () {
            if (this._program) {
                var block = this._blocks.getWeakRef(this.uuid);
                if (block) {
                    block.unbind();
                    unbindProgramAttribLocations(this._program, this.canvasId);
                }
                else {
                    throw new Error(messageUnrecognizedMesh(this.uuid));
                }
                this._program.release();
                this._program = void 0;
            }
        };
        return BufferGeometry;
    })(Shareable_1.default);
    function webgl(attributes) {
        var uuid = uuid4_1.default().generate();
        var _blocks = new StringIUnknownMap_1.default();
        var users = [];
        function addContextListener(user) {
            mustBeObject_1.default('user', user);
            var index = users.indexOf(user);
            if (index < 0) {
                users.push(user);
            }
            else {
                console.warn("user already exists for addContextListener");
            }
        }
        function removeContextListener(user) {
            mustBeObject_1.default('user', user);
            var index = users.indexOf(user);
            if (index >= 0) {
                var removals = users.splice(index, 1);
            }
            else {
            }
        }
        function synchronize(user) {
            if (gl) {
                if (gl.isContextLost()) {
                    user.contextLost(_canvasId);
                }
                else {
                    user.contextGain(kahuna);
                }
            }
            else {
            }
        }
        var gl;
        var _canvas;
        var _canvasId;
        var refCount = 0;
        var tokenArg = expectArg_1.default('token', "");
        var webGLContextLost = function (event) {
            if (isDefined_1.default(_canvas)) {
                event.preventDefault();
                gl = void 0;
                users.forEach(function (user) {
                    user.contextLost(_canvasId);
                });
            }
        };
        var webGLContextRestored = function (event) {
            if (isDefined_1.default(_canvas)) {
                event.preventDefault();
                gl = initWebGL_1.default(_canvas, attributes);
                users.forEach(function (user) {
                    user.contextGain(kahuna);
                });
            }
        };
        var kahuna = {
            get canvasId() {
                return _canvasId;
            },
            createBufferGeometry: function (primitive, usage) {
                mustBeObject_1.default('primitive', primitive);
                mustBeInteger_1.default('primitive.mode', primitive.mode);
                mustBeArray_1.default('primitive.indices', primitive.indices);
                mustBeObject_1.default('primitive.attributes', primitive.attributes);
                if (isDefined_1.default(usage)) {
                    expectArg_1.default('usage', usage).toSatisfy(isBufferUsage(usage), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    usage = isDefined_1.default(gl) ? gl.STATIC_DRAW : void 0;
                }
                if (isUndefined_1.default(gl)) {
                    if (core_1.default.verbose) {
                        console.warn("Impossible to create a buffer geometry without a WebGL context.");
                    }
                    return void 0;
                }
                var mesh = new BufferGeometry(_canvasId, gl, _blocks);
                var indexBuffer = kahuna.createElementArrayBuffer();
                indexBuffer.bind();
                if (isDefined_1.default(gl)) {
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(primitive.indices), usage);
                }
                else {
                    console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.");
                }
                indexBuffer.unbind();
                var attributes = new StringIUnknownMap_1.default();
                var names = Object.keys(primitive.attributes);
                var namesLength = names.length;
                for (var i = 0; i < namesLength; i++) {
                    var name_1 = names[i];
                    var buffer = kahuna.createArrayBuffer();
                    buffer.bind();
                    var vertexAttrib = primitive.attributes[name_1];
                    var data = vertexAttrib.values;
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
                    var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
                    attributes.put(name_1, attribute);
                    attribute.release();
                    buffer.unbind();
                    buffer.release();
                }
                var drawCommand = new DrawElementsCommand(primitive.mode, primitive.indices.length, gl.UNSIGNED_SHORT, 0);
                var block = new ElementsBlock(indexBuffer, attributes, drawCommand);
                _blocks.put(mesh.uuid, block);
                block.release();
                attributes.release();
                indexBuffer.release();
                return mesh;
            },
            start: function (canvas, canvasId) {
                if (canvasId === void 0) { canvasId = 0; }
                var alreadyStarted = isDefined_1.default(_canvas);
                if (!alreadyStarted) {
                    _canvas = canvas;
                    _canvasId = canvasId;
                }
                else {
                    mustBeInteger_1.default('_canvasId', _canvasId);
                    if (core_1.default.verbose) {
                        console.warn(LOGGING_NAME_KERNEL + " Ignoring start() because already started.");
                    }
                    return;
                }
                if (isDefined_1.default(_canvas)) {
                    gl = initWebGL_1.default(_canvas, attributes);
                    users.forEach(function (user) {
                        kahuna.synchronize(user);
                    });
                    _canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                    _canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                }
            },
            stop: function () {
                if (isDefined_1.default(_canvas)) {
                    _canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                    _canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
                    if (gl) {
                        if (gl.isContextLost()) {
                            users.forEach(function (user) { user.contextLost(_canvasId); });
                        }
                        else {
                            users.forEach(function (user) { user.contextFree(_canvasId); });
                        }
                        gl = void 0;
                    }
                    _canvas = void 0;
                    _canvasId = void 0;
                }
            },
            addContextListener: function (user) {
                addContextListener(user);
            },
            removeContextListener: function (user) {
                removeContextListener(user);
            },
            synchronize: function (user) {
                synchronize(user);
            },
            get canvas() {
                if (!_canvas) {
                    kahuna.start(document.createElement('canvas'), randumbInteger_1.default());
                }
                return _canvas;
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
                refChange_1.default(uuid, LOGGING_NAME_KERNEL, +1);
                return refCount;
            },
            release: function () {
                refCount--;
                refChange_1.default(uuid, LOGGING_NAME_KERNEL, -1);
                if (refCount === 0) {
                    _blocks.release();
                    while (users.length > 0) {
                        var user = users.pop();
                    }
                }
                return refCount;
            },
            createArrayBuffer: function () {
                return new BufferResource_1.default(kahuna, false);
            },
            createElementArrayBuffer: function () {
                return new BufferResource_1.default(kahuna, true);
            },
            createTexture2D: function () {
                return new TextureResource_1.default([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
            },
            createTextureCubeMap: function () {
                return new TextureResource_1.default([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
            }
        };
        kahuna.addRef();
        return kahuna;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = webgl;
});
