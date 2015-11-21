var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/BufferResource', '../core/DrawMode', '../core', '../geometries/DrawPrimitive', '../checks/expectArg', '../renderers/initWebGL', '../checks/isDefined', '../checks/isUndefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../utils/randumbInteger', '../utils/refChange', '../utils/Shareable', '../collections/StringIUnknownMap', '../resources/TextureResource', '../utils/uuid4'], function (require, exports, BufferResource, DrawMode, core, DrawPrimitive, expectArg, initWebGL, isDefined, isUndefined, mustBeInteger, mustBeNumber, mustBeObject, mustBeString, randumbInteger, refChange, Shareable, StringIUnknownMap, TextureResource, uuid4) {
    var LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
    var LOGGING_NAME_MESH = 'Drawable';
    var LOGGING_NAME_KAHUNA = 'ContextKahuna';
    function mustBeContext(gl, method) {
        if (gl) {
            return gl;
        }
        else {
            throw new Error(method + ": gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
        }
    }
    /**
     * Renders geometric primitives indexed by element array data.
     */
    var DrawElementsCommand = (function () {
        /**
         *
         */
        function DrawElementsCommand(mode, count, type, offset) {
            mustBeInteger('mode', mode);
            mustBeInteger('count', count);
            mustBeInteger('type', type);
            mustBeInteger('offset', offset);
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }
        /**
         * Executes the drawElements command using the instance state.
         */
        DrawElementsCommand.prototype.execute = function (gl) {
            if (isDefined(gl)) {
                switch (this.mode) {
                    case DrawMode.TRIANGLE_STRIP:
                        gl.drawElements(gl.TRIANGLE_STRIP, this.count, this.type, this.offset);
                        break;
                    case DrawMode.TRIANGLE_FAN:
                        gl.drawElements(gl.TRIANGLE_FAN, this.count, this.type, this.offset);
                        break;
                    case DrawMode.TRIANGLES:
                        gl.drawElements(gl.TRIANGLES, this.count, this.type, this.offset);
                        break;
                    case DrawMode.LINE_STRIP:
                        gl.drawElements(gl.LINE_STRIP, this.count, this.type, this.offset);
                        break;
                    case DrawMode.LINE_LOOP:
                        gl.drawElements(gl.LINE_LOOP, this.count, this.type, this.offset);
                        break;
                    case DrawMode.LINES:
                        gl.drawElements(gl.LINES, this.count, this.type, this.offset);
                        break;
                    case DrawMode.POINTS:
                        gl.drawElements(gl.POINTS, this.count, this.type, this.offset);
                        break;
                    default:
                        throw new Error("mode: " + this.mode);
                }
            }
        };
        return DrawElementsCommand;
    })();
    /**
     *
     */
    var ElementsBlock = (function (_super) {
        __extends(ElementsBlock, _super);
        /**
         *
         */
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
        /**
         *
         */
        ElementsBlock.prototype.bind = function () {
            this._indexBuffer.bind();
        };
        ElementsBlock.prototype.unbind = function () {
            this._indexBuffer.unbind();
        };
        Object.defineProperty(ElementsBlock.prototype, "attributes", {
            // FIXME: Can we hide _attributes and avoid the addRef too?
            get: function () {
                this._attributes.addRef();
                return this._attributes;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlock;
    })(Shareable);
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
            // FIXME: can we hide _buffer and avoid the addRef at the same time?
            get: function () {
                this._buffer.addRef();
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlockAttrib;
    })(Shareable);
    function isBufferUsage(usage) {
        mustBeNumber('usage', usage);
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
        mustBeString('uuid', uuid);
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
    /**
     *
     */
    function bindProgramAttribLocations(program, block, aNameToKeyName, canvasId) {
        // FIXME: This is where we get the IGraphicsProgram attributes property.
        // FIXME: Can we invert this?
        // What are we offering to the program:
        // block.attributes (reference counted)
        // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
        // in order to get the name -> index correct.
        // Then attribute setting should go much faster
        var attribLocations = program.attributes(canvasId);
        if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                var aName = aNames[i];
                var key = attribKey(aName, aNameToKeyName);
                // FIXME: Can we delegate this to the block to prevent addRef and release?
                var attributes = block.attributes;
                var attribute = attributes.getWeakRef(key);
                if (attribute) {
                    // Associate the attribute buffer with the attribute location.
                    // FIXME Would be nice to be able to get a weak reference to the buffer.
                    var buffer = attribute.buffer;
                    buffer.bind();
                    var attributeLocation = attribLocations[aName];
                    attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                    buffer.unbind();
                    attributeLocation.enable();
                    buffer.release();
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
            console.warn("program.attributes is falsey.");
        }
    }
    function unbindProgramAttribLocations(program, canvasId) {
        // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
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
    /**
     * Implementation of IBufferGeometry coupled to the 'blocks' implementation.
     */
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
            // FIXME: Check status of GraphicsProgram?
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
                        // FIXME: Make this a part of the block bind method?
                        bindProgramAttribLocations(this._program, block, aNameToKeyName, this.canvasId);
                    }
                    else {
                        mustBeObject('program', program);
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
                // FIXME: Wondering why we don't just make this a parameter?
                // On the other hand, buffer geometry is only good for one context.
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
                    // FIXME: Make this a part of the block unbind method?
                    unbindProgramAttribLocations(this._program, this.canvasId);
                }
                else {
                    throw new Error(messageUnrecognizedMesh(this.uuid));
                }
                // We bumped up the reference count during bind. Now we are done.
                this._program.release();
                // Important! The existence of _program indicates the binding state.
                this._program = void 0;
            }
        };
        return BufferGeometry;
    })(Shareable);
    function webgl(attributes) {
        var uuid = uuid4().generate();
        var _blocks = new StringIUnknownMap();
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        // // FIXME: Really? Not IUnknownArray<IIContextConsumer> ?
        var users = [];
        function addContextListener(user) {
            mustBeObject('user', user);
            var index = users.indexOf(user);
            if (index < 0) {
                users.push(user);
            }
            else {
                console.warn("user already exists for addContextListener");
            }
        }
        /**
         * Implementation of removeContextListener for the kahuna.
         */
        function removeContextListener(user) {
            mustBeObject('user', user);
            var index = users.indexOf(user);
            if (index >= 0) {
                // FIXME: Potential leak here if IContextConsumer extends IUnknown
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
        /**
         * We must cache the canvas so that we can remove listeners when `stop() is called.
         * Only between `start()` and `stop()` is canvas defined.
         * We use a canvasBuilder so the other initialization can happen while we are waiting
         * for the DOM to load.
         */
        var _canvas;
        var _canvasId;
        var refCount = 0;
        var tokenArg = expectArg('token', "");
        var webGLContextLost = function (event) {
            if (isDefined(_canvas)) {
                event.preventDefault();
                gl = void 0;
                users.forEach(function (user) {
                    user.contextLost(_canvasId);
                });
            }
        };
        var webGLContextRestored = function (event) {
            if (isDefined(_canvas)) {
                event.preventDefault();
                gl = initWebGL(_canvas, attributes);
                users.forEach(function (user) {
                    user.contextGain(kahuna);
                });
            }
        };
        var kahuna = {
            get canvasId() {
                return _canvasId;
            },
            /**
             *
             */
            createBufferGeometry: function (primitive, usage) {
                expectArg('primitive', primitive).toSatisfy(primitive instanceof DrawPrimitive, "primitive must be an instance of DrawPrimitive");
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    usage = isDefined(gl) ? gl.STATIC_DRAW : void 0;
                }
                // It's going to get pretty hopeless without a WebGL context.
                // If that's the case, let's just return undefined now before we start allocating useless stuff.
                if (isUndefined(gl)) {
                    if (core.verbose) {
                        console.warn("Impossible to create a buffer geometry without a WebGL context.");
                    }
                    return void 0;
                }
                var mesh = new BufferGeometry(_canvasId, gl, _blocks);
                var indexBuffer = kahuna.createElementArrayBuffer();
                indexBuffer.bind();
                if (isDefined(gl)) {
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(primitive.indices), usage);
                }
                else {
                    console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.");
                }
                indexBuffer.unbind();
                var attributes = new StringIUnknownMap();
                var names = Object.keys(primitive.attributes);
                var namesLength = names.length;
                for (var i = 0; i < namesLength; i++) {
                    var name_1 = names[i];
                    var buffer = kahuna.createArrayBuffer();
                    buffer.bind();
                    var vertexAttrib = primitive.attributes[name_1];
                    var data = vertexAttrib.values;
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
                    // TODO: stride = 0 and offset = 0
                    var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.chunkSize, false, 0, 0);
                    attributes.put(name_1, attribute);
                    attribute.release();
                    buffer.unbind();
                    buffer.release();
                }
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                // TODO: Notice that the offset is zero. How do we reuse a buffer.
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
                var alreadyStarted = isDefined(_canvas);
                if (!alreadyStarted) {
                    // cache the arguments
                    _canvas = canvas;
                    _canvasId = canvasId;
                }
                else {
                    // We'll assert that if we have a canvas element then we should have a canvas id.
                    mustBeInteger('_canvasId', _canvasId);
                    // We'll just be idempotent and ignore the call because we've already been started.
                    // To use the canvas might conflict with one we have dynamically created.
                    if (core.verbose) {
                        console.warn("Ignoring `start()` because already started.");
                    }
                    return;
                }
                // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
                // To not complain is the way of the hyper-functional warrior.
                if (isDefined(_canvas)) {
                    gl = initWebGL(_canvas, attributes);
                    users.forEach(function (user) {
                        kahuna.synchronize(user);
                    });
                    _canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                    _canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                }
            },
            stop: function () {
                if (isDefined(_canvas)) {
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
                    // Interesting little side-effect!
                    // Love the way kahuna talks in the third person.
                    kahuna.start(document.createElement('canvas'), randumbInteger());
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
                refChange(uuid, LOGGING_NAME_KAHUNA, +1);
                return refCount;
            },
            release: function () {
                refCount--;
                refChange(uuid, LOGGING_NAME_KAHUNA, -1);
                if (refCount === 0) {
                    _blocks.release();
                    while (users.length > 0) {
                        var user = users.pop();
                    }
                }
                return refCount;
            },
            createArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern?
                return new BufferResource(kahuna, false);
            },
            createElementArrayBuffer: function () {
                // TODO: Replace with functional constructor pattern?
                // FIXME
                // It's a bit draconian to insist that there be a WegGLRenderingContext.
                // Especially whenthe BufferResource willl be listening for context coming and goings.
                // Let's be Hyper-Functional Warrior and let it go.
                // Only problem is, we don't know if we should be handling elements or attributes. No problem.
                return new BufferResource(kahuna, true);
            },
            createTexture2D: function () {
                // TODO: Replace with functional constructor pattern.
                // FIXME Does this mean that Texture only has one IContextMonitor?
                return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
            },
            createTextureCubeMap: function () {
                // TODO: Replace with functional constructor pattern.
                return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
            }
        };
        kahuna.addRef();
        return kahuna;
    }
    return webgl;
});
