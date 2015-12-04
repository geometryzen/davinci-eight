import BufferResource = require('../core/BufferResource')
import ContextKahuna = require('../core/ContextKahuna')
import DrawMode = require('../core/DrawMode')
import IContextProvider = require('../core/IContextProvider')
import IContextConsumer = require('../core/IContextConsumer')
import core = require('../core')
import expectArg = require('../checks/expectArg')
import initWebGL = require('../renderers/initWebGL')
import IBuffer = require('../core/IBuffer')
import IBufferGeometry = require('../geometries/IBufferGeometry')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')
import isUndefined = require('../checks/isUndefined')
import ITexture = require('../core/ITexture')
import IUnknown = require('../core/IUnknown')
import IGraphicsProgram = require('../core/IGraphicsProgram')
import mustBeArray = require('../checks/mustBeArray')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import randumbInteger = require('../utils/randumbInteger');
import Primitive = require('../geometries/Primitive')
import RefCount = require('../utils/RefCount')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import StringIUnknownMap = require('../collections/StringIUnknownMap')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
import TextureResource = require('../resources/TextureResource')
import uuid4 = require('../utils/uuid4')
import VectorN = require('../math/VectorN')

let LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib'
let LOGGING_NAME_MESH = 'Drawable'

let LOGGING_NAME_KAHUNA = 'ContextKahuna'

function mustBeContext(gl: WebGLRenderingContext, method: string): WebGLRenderingContext {
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
class DrawElementsCommand {

    /**
     * Specifies the kind of primitives to render.
     */
    private mode: DrawMode;

    /**
     * The number of elements to render.
     */
    private count: number;

    /**
     * The type of elements in the element array buffer. Usually a gl.UNSIGNED_SHORT.
     */
    private type: number;

    /**
     * Offset into the element array buffer. Must be a valid multiple of the size of type.
     */
    private offset: number;

    /**
     *
     */
    constructor(mode: DrawMode, count: number, type: number, offset: number) {
        mustBeInteger('mode', mode)
        mustBeInteger('count', count)
        mustBeInteger('type', type)
        mustBeInteger('offset', offset)
        this.mode = mode
        this.count = count
        this.type = type
        this.offset = offset
    }

    /**
     * Executes the drawElements command using the instance state.
     */
    execute(gl: WebGLRenderingContext) {
        if (isDefined(gl)) {
            switch (this.mode) {
                case DrawMode.TRIANGLE_STRIP:
                    gl.drawElements(gl.TRIANGLE_STRIP, this.count, this.type, this.offset)
                    break
                case DrawMode.TRIANGLE_FAN:
                    gl.drawElements(gl.TRIANGLE_FAN, this.count, this.type, this.offset)
                    break
                case DrawMode.TRIANGLES:
                    gl.drawElements(gl.TRIANGLES, this.count, this.type, this.offset)
                    break
                case DrawMode.LINE_STRIP:
                    gl.drawElements(gl.LINE_STRIP, this.count, this.type, this.offset)
                    break
                case DrawMode.LINE_LOOP:
                    gl.drawElements(gl.LINE_LOOP, this.count, this.type, this.offset)
                    break
                case DrawMode.LINES:
                    gl.drawElements(gl.LINES, this.count, this.type, this.offset)
                    break
                case DrawMode.POINTS:
                    gl.drawElements(gl.POINTS, this.count, this.type, this.offset)
                    break
                default:
                    throw new Error("mode: " + this.mode)
            }
        }
    }
}

/**
 *
 */
class ElementsBlock extends Shareable {

    /**
     * Mapping from attribute name to a data structure describing and containing a buffer.
     */
    private _attributes: StringIUnknownMap<ElementsBlockAttrib>;

    /**
     * The buffer containing element indices used in the drawElements command.
     * We keep the index buffer private to avoid unnecessary addRef() and release() calls.
     */
    private _indexBuffer: IBuffer;

    /**
     * An executable command. May be a call to drawElements or drawArrays.
     */
    public drawCommand: DrawElementsCommand;

    /**
     *
     */
    constructor(indexBuffer: IBuffer, attributes: StringIUnknownMap<ElementsBlockAttrib>, drawCommand: DrawElementsCommand) {
        super('ElementsBlock')
        this._indexBuffer = indexBuffer
        this._indexBuffer.addRef()
        this._attributes = attributes
        this._attributes.addRef()
        this.drawCommand = drawCommand
    }

    protected destructor(): void {
        this._attributes.release()
        this._attributes = void 0
        this._indexBuffer.release()
        this._indexBuffer = void 0
        super.destructor()
    }

    /**
     * 
     */
    bind() {
        this._indexBuffer.bind()
    }

    unbind() {
        this._indexBuffer.unbind()
    }

    // FIXME: Can we hide _attributes and avoid the addRef too?
    get attributes(): StringIUnknownMap<ElementsBlockAttrib> {
        this._attributes.addRef()
        return this._attributes
    }
}

class ElementsBlockAttrib extends Shareable {
    private _buffer: IBuffer;
    public size: number;
    public normalized: boolean;
    public stride: number;
    public offset: number;
    constructor(buffer: IBuffer, size: number, normalized: boolean, stride: number, offset: number) {
        super(LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE)
        this._buffer = buffer;
        this._buffer.addRef();
        this.size = size;
        this.normalized = normalized;
        this.stride = stride;
        this.offset = offset;
    }
    destructor(): void {
        this._buffer.release();
        this._buffer = void 0;
        this.size = void 0;
        this.normalized = void 0;
        this.stride = void 0;
        this.offset = void 0;
    }
    // FIXME: can we hide _buffer and avoid the addRef at the same time?
    get buffer() {
        this._buffer.addRef();
        return this._buffer;
    }
}

// FIXME: usage must be defined as an enumeration like DrawMode
function isBufferUsage(usage: number): boolean {
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

function messageUnrecognizedMesh(uuid: string): string {
    mustBeString('uuid', uuid);
    return uuid + " is not a recognized mesh uuid";
}

function attribKey(aName: string, aNameToKeyName?: { [aName: string]: string }): string {
    if (aNameToKeyName) {
        let key = aNameToKeyName[aName];
        return key ? key : aName;
    }
    else {
        return aName;
    }
}

/**
 *
 */
function bindProgramAttribLocations(program: IGraphicsProgram, block: ElementsBlock, aNameToKeyName?: { [name: string]: string }, canvasId?: number) {
    // FIXME: This is where we get the IGraphicsProgram attributes property.
    // FIXME: Can we invert this?
    // What are we offering to the program:
    // block.attributes (reference counted)
    // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
    // in order to get the name -> index correct.
    // Then attribute setting should go much faster
    let attribLocations = program.attributes(canvasId)
    if (attribLocations) {
        let aNames = Object.keys(attribLocations)
        for (var i = 0, iLength = aNames.length; i < iLength; i++) {
            let aName = aNames[i]
            let key: string = attribKey(aName, aNameToKeyName)
            // FIXME: Can we delegate this to the block to prevent addRef and release?
            let attributes = block.attributes
            let attribute = attributes.getWeakRef(key)
            if (attribute) {
                // Associate the attribute buffer with the attribute location.
                // FIXME Would be nice to be able to get a weak reference to the buffer.
                let buffer = attribute.buffer
                buffer.bind()
                let attributeLocation = attribLocations[aName]
                attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset)
                buffer.unbind()

                attributeLocation.enable()
                buffer.release()
            }
            else {
                // The attribute available may not be required by the program.
                // TODO: (1) Named programs, (2) disable warning by attribute?
                // Do not allow Attribute 0 to be disabled.
                console.warn("program attribute " + aName + " is not satisfied by the mesh")
            }
            attributes.release()
        }
    }
    else {
        console.warn("program.attributes is falsey.")
    }
}

function unbindProgramAttribLocations(program: IGraphicsProgram, canvasId?: number) {
    // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
    let attribLocations = program.attributes(canvasId)
    if (attribLocations) {
        let aNames = Object.keys(attribLocations)
        for (var i = 0, iLength = aNames.length; i < iLength; i++) {
            attribLocations[aNames[i]].disable()
        }
    }
    else {
        console.warn("program.attributes is falsey.")
    }
}

/**
 * Implementation of IBufferGeometry coupled to the 'blocks' implementation.
 */
class BufferGeometry extends Shareable implements IBufferGeometry {
    private canvasId: number;
    private _program: IGraphicsProgram;
    private _blocks: StringIUnknownMap<ElementsBlock>;
    private gl: WebGLRenderingContext;
    constructor(canvasId: number, gl: WebGLRenderingContext, blocks: StringIUnknownMap<ElementsBlock>) {
        super('BufferGeometry')
        this.canvasId = canvasId
        this._blocks = blocks
        this._blocks.addRef()
        this.gl = gl
    }
    protected destructor(): void {
        // FIXME: Check status of GraphicsProgram?
        this._blocks.release()
        this._blocks = void 0
        this.gl = void 0
        super.destructor()
    }
    bind(program: IGraphicsProgram, aNameToKeyName?: { [name: string]: string }): void {
        if (this._program !== program) {
            if (this._program) {
                this.unbind()
            }
            let block = this._blocks.getWeakRef(this.uuid)
            if (block) {
                if (program) {
                    this._program = program
                    this._program.addRef()
                    block.bind()
                    // FIXME: Make this a part of the block bind method?
                    bindProgramAttribLocations(this._program, block, aNameToKeyName, this.canvasId)
                }
                else {
                    mustBeObject('program', program)
                }
            }
            else {
                throw new Error(messageUnrecognizedMesh(this.uuid))
            }
        }
    }
    draw(): void {
        let block = this._blocks.getWeakRef(this.uuid)
        if (block) {
            // FIXME: Wondering why we don't just make this a parameter?
            // On the other hand, buffer geometry is only good for one context.
            block.drawCommand.execute(this.gl)
        }
        else {
            throw new Error(messageUnrecognizedMesh(this.uuid));
        }
    }
    unbind(): void {
        if (this._program) {
            let block = this._blocks.getWeakRef(this.uuid)
            if (block) {
                block.unbind()
                // FIXME: Make this a part of the block unbind method?
                unbindProgramAttribLocations(this._program, this.canvasId)
            }
            else {
                throw new Error(messageUnrecognizedMesh(this.uuid));
            }
            // We bumped up the reference count during bind. Now we are done.
            this._program.release()
            // Important! The existence of _program indicates the binding state.
            this._program = void 0
        }
    }
}

function webgl(attributes?: WebGLContextAttributes): ContextKahuna {
    let uuid: string = uuid4().generate();
    let _blocks = new StringIUnknownMap<ElementsBlock>();
    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    // // FIXME: Really? Not IUnknownArray<IIContextConsumer> ?
    let users: IContextConsumer[] = [];

    function addContextListener(user: IContextConsumer): void {
        mustBeObject('user', user)
        let index = users.indexOf(user)
        if (index < 0) {
            users.push(user)
        }
        else {
            console.warn("user already exists for addContextListener")
        }
    }

    /**
     * Implementation of removeContextListener for the kahuna.
     */
    function removeContextListener(user: IContextConsumer): void {
        mustBeObject('user', user)
        let index = users.indexOf(user)
        if (index >= 0) {
            // FIXME: Potential leak here if IContextConsumer extends IUnknown
            let removals = users.splice(index, 1)
        }
        else {
            // It may be that we just  can't do this.
            // Cycles are a problem for reference counting so we have to
            // live with having weak references in one direction.
            // console.warn("user not found for removeContextListener(user)")
        }
    }
    function synchronize(user: IContextConsumer): void {
        if (gl) {
            if (gl.isContextLost()) {
                user.contextLost(_canvasId);
            }
            else {
                user.contextGain(kahuna);
            }
        }
        else {
            // FIXME: Broken symmetry.
            // user.contextFree(_canvasId)
        }
    }

    var gl: WebGLRenderingContext
    /**
     * We must cache the canvas so that we can remove listeners when `stop() is called.
     * Only between `start()` and `stop()` is canvas defined.
     * We use a canvasBuilder so the other initialization can happen while we are waiting
     * for the DOM to load. 
     */
    var _canvas: HTMLCanvasElement
    var _canvasId: number
    var refCount: number = 0
    let tokenArg = expectArg('token', "")

    let webGLContextLost = function(event: Event) {
        if (isDefined(_canvas)) {
            event.preventDefault()
            gl = void 0
            users.forEach(function(user: IContextConsumer) {
                user.contextLost(_canvasId)
            })
        }
    }

    let webGLContextRestored = function(event: Event) {
        if (isDefined(_canvas)) {
            event.preventDefault()
            gl = initWebGL(_canvas, attributes)
            users.forEach(function(user: IContextConsumer) {
                user.contextGain(kahuna)
            })
        }
    }

    var kahuna: ContextKahuna = {
        get canvasId(): number {
            return _canvasId;
        },

        /**
         *
         */
        createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry {
            mustBeObject('primitive', primitive);
            mustBeInteger('primitive.mode', primitive.mode);
            mustBeArray('primitive.indices', primitive.indices);
            mustBeObject('primitive.attributes', primitive.attributes);
            if (isDefined(usage)) {
                expectArg('usage', usage).toSatisfy(isBufferUsage(usage), "usage must be on of STATIC_DRAW, ...")
            }
            else {
                usage = isDefined(gl) ? gl.STATIC_DRAW : void 0
            }
            // It's going to get pretty hopeless without a WebGL context.
            // If that's the case, let's just return undefined now before we start allocating useless stuff.
            if (isUndefined(gl)) {
                if (core.verbose) {
                    console.warn("Impossible to create a buffer geometry without a WebGL context.")
                }
                return void 0
            }

            let mesh: IBufferGeometry = new BufferGeometry(_canvasId, gl, _blocks)

            let indexBuffer: IBuffer = kahuna.createElementArrayBuffer()
            indexBuffer.bind();
            if (isDefined(gl)) {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(primitive.indices), usage);
            }
            else {
                console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.")
            }
            indexBuffer.unbind();

            let attributes = new StringIUnknownMap<ElementsBlockAttrib>()
            let names = Object.keys(primitive.attributes)
            let namesLength = names.length
            for (var i = 0; i < namesLength; i++) {
                let name = names[i]
                let buffer: IBuffer = kahuna.createArrayBuffer()
                buffer.bind()
                let vertexAttrib = primitive.attributes[name]
                let data: number[] = vertexAttrib.values
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage)
                // TODO: stride = 0 and offset = 0
                let attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0)
                attributes.put(name, attribute)
                attribute.release()
                buffer.unbind()
                buffer.release()
            }
            // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
            // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
            // TODO: Notice that the offset is zero. How do we reuse a buffer.
            let drawCommand = new DrawElementsCommand(primitive.mode, primitive.indices.length, gl.UNSIGNED_SHORT, 0)
            var block = new ElementsBlock(indexBuffer, attributes, drawCommand)
            _blocks.put(mesh.uuid, block)
            block.release()
            attributes.release()
            indexBuffer.release()
            return mesh
        },
        start(canvas: HTMLCanvasElement, canvasId: number = 0): void {
            let alreadyStarted = isDefined(_canvas);
            if (!alreadyStarted) {
                // cache the arguments
                _canvas = canvas
                _canvasId = canvasId
            }
            else {
                // We'll assert that if we have a canvas element then we should have a canvas id.
                mustBeInteger('_canvasId', _canvasId);
                // We'll just be idempotent and ignore the call because we've already been started.
                // To use the canvas might conflict with one we have dynamically created.
                if (core.verbose) {
                    console.warn("Ignoring `start()` because already started.")
                }
                return
            }
            // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
            // To not complain is the way of the hyper-functional warrior.
            if (isDefined(_canvas)) {
                gl = initWebGL(_canvas, attributes);
                users.forEach(function(user: IContextConsumer) {
                    kahuna.synchronize(user)
                })
                _canvas.addEventListener('webglcontextlost', webGLContextLost, false)
                _canvas.addEventListener('webglcontextrestored', webGLContextRestored, false)
            }
        },
        stop(): void {
            if (isDefined(_canvas)) {
                _canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false)
                _canvas.removeEventListener('webglcontextlost', webGLContextLost, false)
                if (gl) {
                    if (gl.isContextLost()) {
                        users.forEach(function(user: IContextConsumer) { user.contextLost(_canvasId) })
                    }
                    else {
                        users.forEach(function(user: IContextConsumer) { user.contextFree(_canvasId) })
                    }
                    gl = void 0;
                }
                _canvas = void 0;
                _canvasId = void 0;
            }
        },
        addContextListener(user: IContextConsumer): void {
            addContextListener(user);
        },
        removeContextListener(user: IContextConsumer): void {
            removeContextListener(user);
        },
        synchronize(user: IContextConsumer): void {
            synchronize(user)
        },
        get canvas(): HTMLCanvasElement {
            if (!_canvas) {
                // Interesting little side-effect!
                // Love the way kahuna talks in the third person.
                kahuna.start(document.createElement('canvas'), randumbInteger());
            }
            return _canvas;
        },
        get gl(): WebGLRenderingContext {
            if (gl) {
                return gl;
            }
            else {
                console.warn("property gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
                return void 0;
            }
        },
        addRef(): number {
            refCount++;
            refChange(uuid, LOGGING_NAME_KAHUNA, +1);
            return refCount;
        },
        release(): number {
            refCount--;
            refChange(uuid, LOGGING_NAME_KAHUNA, -1);
            if (refCount === 0) {
                _blocks.release();
                while (users.length > 0) {
                    let user = users.pop();
                }
            }
            return refCount;
        },
        createArrayBuffer(): IBuffer {
            // TODO: Replace with functional constructor pattern?
            return new BufferResource(kahuna, false);
        },
        createElementArrayBuffer(): IBuffer {
            // TODO: Replace with functional constructor pattern?
            // FIXME
            // It's a bit draconian to insist that there be a WegGLRenderingContext.
            // Especially whenthe BufferResource willl be listening for context coming and goings.
            // Let's be Hyper-Functional Warrior and let it go.
            // Only problem is, we don't know if we should be handling elements or attributes. No problem.
            return new BufferResource(kahuna, true);
        },
        createTexture2D(): ITexture {
            // TODO: Replace with functional constructor pattern.
            // FIXME Does this mean that Texture only has one IContextMonitor?
            return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
        },
        createTextureCubeMap(): ITexture {
            // TODO: Replace with functional constructor pattern.
            return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
        }
    };
    kahuna.addRef()
    return kahuna;
}

export = webgl;
