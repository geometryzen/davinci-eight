var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/BufferResource', '../core', '../dfx/GeometryData', '../checks/expectArg', '../renderers/initWebGL', '../checks/isDefined', '../checks/isUndefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../checks/mustBeString', '../utils/randumbInteger', '../utils/RefCount', '../utils/refChange', '../utils/Shareable', '../dfx/Simplex', '../utils/StringIUnknownMap', '../resources/TextureResource', '../utils/uuid4'], function (require, exports, BufferResource, core, GeometryData, expectArg, initWebGL, isDefined, isUndefined, mustBeInteger, mustBeNumber, mustBeString, randumbInteger, RefCount, refChange, Shareable, Simplex, StringIUnknownMap, TextureResource, uuid4) {
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
     * class GeometryDataCommand
     * private
     */
    var GeometryDataCommand = (function () {
        /**
         * class GeometryDataCommand
         * constructor
         */
        function GeometryDataCommand(mode, count, type, offset) {
            this.mode = mode;
            this.count = count;
            this.type = type;
            this.offset = offset;
        }
        /**
         * Executes the drawElements command using the instance state.
         * method execute
         * param gl {WebGLRenderingContext}
         */
        GeometryDataCommand.prototype.execute = function (gl) {
            if (isDefined(gl)) {
                gl.drawElements(this.mode, this.count, this.type, this.offset);
            }
            else {
                console.warn("HFW: Er, like hey dude! You're asking me to draw something without a context. That's not cool, but I won't complain.");
            }
        };
        return GeometryDataCommand;
    })();
    /**
     * class ElementsBlock
     */
    var ElementsBlock = (function (_super) {
        __extends(ElementsBlock, _super);
        /**
         * class ElementsBlock
         * constructor
         */
        function ElementsBlock(indexBuffer, attributes, drawCommand) {
            _super.call(this, LOGGING_NAME_ELEMENTS_BLOCK);
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
        };
        Object.defineProperty(ElementsBlock.prototype, "indexBuffer", {
            get: function () {
                this._indexBuffer.addRef();
                return this._indexBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementsBlock.prototype, "attributes", {
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
            get: function () {
                this._buffer.addRef();
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsBlockAttrib;
    })(Shareable);
    // TODO: If mode provided, check consistent with elements.k.
    // expectArg('mode', mode).toSatisfy(isDrawMode(mode, gl), "mode must be one of TRIANGLES, ...");
    function drawMode(k, mode) {
        switch (k) {
            case Simplex.K_FOR_TRIANGLE: {
                return mustBeNumber('TRIANGLES', WebGLRenderingContext.TRIANGLES);
            }
            case Simplex.K_FOR_LINE_SEGMENT: {
                return mustBeNumber('LINES', WebGLRenderingContext.LINES);
            }
            case Simplex.K_FOR_POINT: {
                return mustBeNumber('POINTS', WebGLRenderingContext.POINTS);
            }
            case Simplex.K_FOR_EMPTY: {
                return void 0;
            }
            default: {
                throw new Error("Unexpected k-simplex dimension, k => " + k);
            }
        }
    }
    function isDrawMode(mode) {
        mustBeNumber('mode', mode);
        switch (mode) {
            case WebGLRenderingContext.TRIANGLES: {
                return true;
            }
            case WebGLRenderingContext.LINES: {
                return true;
            }
            case WebGLRenderingContext.POINTS: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
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
    // FIXME: Use this function pair to replace BEGIN..END
    /**
     *
     */
    function bindProgramAttribLocations(program, canvasId, block, aNameToKeyName) {
        // FIXME: Expecting canvasId here.
        // FIXME: This is where we get the IMaterial attributes property.
        // FIXME: Can we invert this?
        // What are we offering to the program:
        // block.attributes (reference counted)
        // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
        // in order to get the name -> index correct.
        // Then attribute setting shoul go much faster
        var attribLocations = program.attributes(canvasId);
        if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            var aNamesLength = aNames.length;
            var i;
            for (i = 0; i < aNamesLength; i++) {
                var aName = aNames[i];
                var key = attribKey(aName, aNameToKeyName);
                var attributes = block.attributes;
                var attribute = attributes.getWeakReference(key);
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
            console.warn("bindProgramAttribLocations: program.attributes is falsey.");
        }
    }
    function unbindProgramAttribLocations(program, canvasId) {
        // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
        var attribLocations = program.attributes(canvasId);
        if (attribLocations) {
            Object.keys(attribLocations).forEach(function (aName) {
                attribLocations[aName].disable();
            });
        }
        else {
            console.warn("unbindProgramAttribLocations: program.attributes is falsey.");
        }
    }
    function webgl(attributes) {
        // expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
        // mustBeInteger('canvasId', canvasId, webglFunctionalConstructorContextBuilder);
        var uuid = uuid4().generate();
        var blocks = new StringIUnknownMap();
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        // // FIXME: Really? Not IUnknownArray<IIContextConsumer> ?
        var users = [];
        function addContextListener(user) {
            expectArg('user', user).toBeObject();
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
            expectArg('user', user).toBeObject();
            var index = users.indexOf(user);
            if (index >= 0) {
                var removals = users.splice(index, 1);
            }
            else {
                console.warn("user not found for removeContextListener(user)");
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
        function createBufferGeometry(uuid, canvasId) {
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
                        var block = blocks.getWeakReference(uuid);
                        if (block) {
                            if (program) {
                                _program = program;
                                _program.addRef();
                                var indexBuffer = block.indexBuffer;
                                indexBuffer.bind();
                                indexBuffer.release();
                                bindProgramAttribLocations(_program, canvasId, block, aNameToKeyName);
                            }
                            else {
                                expectArg('program', program).toBeObject();
                            }
                        }
                        else {
                            throw new Error(messageUnrecognizedMesh(uuid));
                        }
                    }
                },
                draw: function () {
                    var block = blocks.getWeakReference(uuid);
                    if (block) {
                        block.drawCommand.execute(gl);
                    }
                    else {
                        throw new Error(messageUnrecognizedMesh(uuid));
                    }
                },
                unbind: function () {
                    if (_program) {
                        var block = blocks.getWeakReference(uuid);
                        if (block) {
                            // FIXME: Ask block to unbind index buffer and avoid addRef/release
                            var indexBuffer = block.indexBuffer;
                            indexBuffer.unbind();
                            indexBuffer.release();
                            // FIXME: Looks like an IMaterial method!
                            unbindProgramAttribLocations(_program, _canvasId);
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
        var gl;
        /**
         * We must cache the canvas so that we can remove listeners when `stop() is called.
         * Only between `start()` and `stop()` is canvas defined.
         * We use a canvasBuilder so the other initialization can happen while we are waiting
         * for the DOM to load.
         */
        var _canvas;
        var _canvasId;
        var refCount = 1;
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
            createBufferGeometry: function (elements, mode, usage) {
                expectArg('elements', elements).toSatisfy(elements instanceof GeometryData, "elements must be an instance of GeometryData");
                mode = drawMode(elements.k, mode);
                if (!isDefined(mode)) {
                    // An empty simplex (k = -1 or vertices.length = k + 1 = 0) begets
                    // something that can't be drawn (no mode) and it is invisible anyway.
                    // In such a case we choose not to allocate any buffers. What would be the usage?
                    return void 0;
                }
                if (isDefined(usage)) {
                    expectArg('usage', usage).toSatisfy(isBufferUsage(usage), "usage must be on of STATIC_DRAW, ...");
                }
                else {
                    // TODO; Perhaps a simpler way to be Hyper Functional Warrior is to use WebGLRenderingContext.STATIC_DRAW?
                    usage = isDefined(gl) ? gl.STATIC_DRAW : void 0;
                }
                // It's going to get pretty hopeless without a WebGL context.
                // If that's the case, let's just return undefined now before we start allocating useless stuff.
                if (isUndefined(gl)) {
                    if (core.verbose) {
                        console.warn("Impossible to create a buffer geometry without a WebGL context. Sorry, no dice!");
                    }
                    return void 0;
                }
                var mesh = createBufferGeometry(uuid4().generate(), _canvasId);
                var indexBuffer = kahuna.createElementArrayBuffer();
                indexBuffer.bind();
                if (isDefined(gl)) {
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
                }
                else {
                    console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.");
                }
                indexBuffer.unbind();
                // FIXME: Advanced. Being able to set an initial reference count would allow me to save a release?
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
                    attributes.putWeakReference(name_1, attribute);
                    buffer.unbind();
                    buffer.release();
                }
                // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
                // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
                switch (elements.k) {
                }
                var drawCommand = new GeometryDataCommand(mode, elements.indices.length, gl.UNSIGNED_SHORT, 0);
                blocks.putWeakReference(mesh.uuid, new ElementsBlock(indexBuffer, attributes, drawCommand));
                attributes.release();
                indexBuffer.release();
                return mesh;
            },
            start: function (canvas, canvasId) {
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
                    blocks.release();
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
                // FIXME Does this mean that Texture only has one ContextMonitor?
                return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
            },
            createTextureCubeMap: function () {
                // TODO: Replace with functional constructor pattern.
                return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
            }
        };
        refChange(uuid, LOGGING_NAME_KAHUNA, +1);
        return kahuna;
    }
    return webgl;
});
