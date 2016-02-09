import Capability from '../commands/Capability';
import DrawMode from './DrawMode';
import Facet from './Facet';
import core from '../core';
import ContextController from './ContextController';
import IContextProvider from './IContextProvider';
import IContextMonitor from './IContextMonitor';
import IContextConsumer from './IContextConsumer';
import ShareableWebGLBuffer from './ShareableWebGLBuffer';
import IContextCommand from './IContextCommand';
import IBufferGeometry from './IBufferGeometry';
import IDrawList from './IDrawList';
import Material from './Material';
import IUnknownArray from '../collections/IUnknownArray';
import initWebGL from './initWebGL';
import isDefined from '../checks/isDefined';
import isUndefined from '../checks/isUndefined';
import mustBeArray from '../checks/mustBeArray';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import mustSatisfy from '../checks/mustSatisfy';
import Primitive from './Primitive';
import readOnly from '../i18n/readOnly';
import Shareable from './Shareable';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import ShareableWebGLTexture from './ShareableWebGLTexture';
import WebGLClearColor from '../commands/WebGLClearColor';
import WebGLEnable from '../commands/WebGLEnable';
import WebGLDisable from '../commands/WebGLDisable';

/**
 * Fundamental abstractions in the architecture.
 *
 * @module EIGHT
 * @submodule core
 */

function isBufferUsage(usage: number): boolean {
    mustBeNumber('usage', usage);
    switch (usage) {
        case WebGLRenderingContext.STATIC_DRAW: {
            return true;
        }
            break;
        default: {
            return false;
        }
    }
}

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
 * A tuple containing (indexBuffer, attributes, drawCommand).
 */
class ElementsBlock extends Shareable implements IContextConsumer {

    /**
     * Mapping from attribute name to a data structure describing and containing a buffer.
     */
    private _attributes: StringIUnknownMap<ElementsBlockAttrib>;

    /**
     * The buffer containing element indices used in the drawElements command.
     * We keep the index buffer private to avoid unnecessary addRef() and release() calls.
     */
    private _indexBuffer: ShareableWebGLBuffer;

    /**
     * An executable command. May be a call to drawElements or drawArrays.
     */
    public drawCommand: DrawElementsCommand;

    /**
     *
     */
    constructor(indexBuffer: ShareableWebGLBuffer, attributes: StringIUnknownMap<ElementsBlockAttrib>, drawCommand: DrawElementsCommand) {
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

    contextFree(context: IContextProvider): void {
        this._indexBuffer.contextFree(context)
        this._attributes.forEach((key, attribute) => {
            attribute.contextFree(context)
        })
    }

    contextGain(context: IContextProvider): void {
        this._indexBuffer.contextGain(context)
        this._attributes.forEach((key, attribute) => {
            attribute.contextGain(context)
        })
    }

    contextLost(): void {
        this._indexBuffer.contextLost()
        this._attributes.forEach((key, attribute) => {
            attribute.contextLost()
        })
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

    get attributes(): StringIUnknownMap<ElementsBlockAttrib> {
        this._attributes.addRef()
        return this._attributes
    }
    set attributes(unused) {
        throw new Error(readOnly('attributes').message)
    }
}

/**
 * Keeps track of the buffer and metadata associated with an 'attribute' variable.
 */
class ElementsBlockAttrib extends Shareable implements IContextConsumer {
    /**
     * The buffer is a shared resource
     */
    private _buffer: ShareableWebGLBuffer;
    public size: number;
    public normalized: boolean;
    public stride: number;
    public offset: number;
    constructor(buffer: ShareableWebGLBuffer, size: number, normalized: boolean, stride: number, offset: number) {
        super('ElementsBlockAttrib')
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
        super.destructor();
    }

    contextFree(context: IContextProvider): void {
        this._buffer.contextFree(context)
    }

    contextGain(context: IContextProvider): void {
        this._buffer.contextGain(context)
    }

    contextLost(): void {
        this._buffer.contextLost()
    }

    get buffer() {
        this._buffer.addRef();
        return this._buffer;
    }
    set buffer(unused) {
        throw new Error(readOnly('buffer').message)
    }
}

function messageUnrecognizedMesh(uuid: string): string {
    mustBeString('uuid', uuid);
    return uuid + " is not a recognized mesh uuid";
}

function attribKey(aName: string, aNameToKeyName?: { [aName: string]: string }): string {
    if (aNameToKeyName) {
        const key = aNameToKeyName[aName];
        return key ? key : aName;
    }
    else {
        return aName;
    }
}

/**
 *
 */
function bindProgramAttribLocations(material: Material, block: ElementsBlock, aNameToKeyName: { [name: string]: string }) {
    const aNames = material.attributeNames
    if (aNames) {
        for (let i = 0, iLength = aNames.length; i < iLength; i++) {
            const aName = aNames[i]
            const key: string = attribKey(aName, aNameToKeyName)
            const attributes = block.attributes
            const attribute: ElementsBlockAttrib = attributes.getWeakRef(key)
            if (attribute) {
                // Associate the attribute buffer with the attribute location.
                // FIXME Would be nice to be able to get a weak reference to the buffer.
                const buffer: ShareableWebGLBuffer = attribute.buffer
                buffer.bind()
                material.vertexPointer(aName, attribute.size, attribute.normalized, attribute.stride, attribute.offset)
                buffer.unbind()
                material.enableAttrib(aName)
                buffer.release()
            }
            else {
                console.warn(`material attribute ${aName} is not satisfied by the mesh`)
            }
            attributes.release()
        }
    }
    else {
        console.warn("material.attributes is falsey.")
    }
}

/**
 * Implementation of IBufferGeometry coupled to the 'blocks' implementation.
 */
class BufferGeometry extends Shareable implements IBufferGeometry {
    private _program: Material;
    private _blocks: StringIUnknownMap<ElementsBlock>;
    private gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext, blocks: StringIUnknownMap<ElementsBlock>) {
        super('BufferGeometry')
        this._blocks = blocks
        this._blocks.addRef()
        this.gl = gl
    }
    protected destructor(): void {
        this._blocks.release()
        this._blocks = void 0
        this.gl = void 0
        super.destructor()
    }
    bind(program: Material, aNameToKeyName?: { [name: string]: string }): void {
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
                    bindProgramAttribLocations(this._program, block, aNameToKeyName)
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
                this._program.disableAttribs()
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

/**
 * @class WebGLRenderer
 * @extends Shareable
 */
export default class WebGLRenderer extends Shareable implements ContextController, IContextProvider, IContextMonitor {

    /**
     * @property _gl
     * @type WebGLRenderingContext
     * @private
     */
    private _gl: WebGLRenderingContext;

    /**
     * @property _blocks
     * @type StringIUnknownMap
     * @private
     */
    private _blocks = new StringIUnknownMap<ElementsBlock>();

    /**
     * @property _canvas
     * @type HTMLCanvasElement
     * @private
     */
    private _canvas: HTMLCanvasElement;

    private _attributes: WebGLContextAttributes;

    // Remark: We only hold weak references to users so that the lifetime of resource
    // objects is not affected by the fact that they are listening for gl events.
    // Users should automatically add themselves upon construction and remove upon release.
    // // FIXME: Really? Not IUnknownArray<IIContextConsumer> ?
    private _users: IContextConsumer[] = [];

    private _webGLContextLost: (event: Event) => any;
    private _webGLContextRestored: (event: Event) => any;

    private _commands = new IUnknownArray<IContextCommand>([])

    /**
     * @class WebGLRenderer
     * @constructor
     * @param [attributes] {WebGLContextAttributes} Allow the context to be configured.
     */
    constructor(attributes?: WebGLContextAttributes) {
        super('WebGLRenderer');
        console.log(`${core.NAMESPACE} ${this._type} ${core.VERSION}`);
        // FIXME: This seems out of place.
        this._attributes = attributes;

        // For convenience.
        this.enable(Capability.DEPTH_TEST);

        this._webGLContextLost = (event: Event) => {
            if (isDefined(this._canvas)) {
                event.preventDefault()
                this._gl = void 0
                this._users.forEach((user: IContextConsumer) => {
                    user.contextLost()
                })
            }
        }

        this._webGLContextRestored = (event: Event) => {
            if (isDefined(this._canvas)) {
                event.preventDefault()
                this._gl = initWebGL(this._canvas, attributes)
                this._users.forEach((user: IContextConsumer) => {
                    user.contextGain(this)
                })
            }
        }
    }

    /**
     * @method destructor
     * return {void}
     * @protected
     */
    protected destructor(): void {
        this.stop();
        this._blocks.release();
        while (this._users.length > 0) {
            this._users.pop();
        }
        this._commands.release();
        super.destructor()
    }

    /**
     * @method addContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    addContextListener(user: IContextConsumer): void {
        mustBeObject('user', user)
        let index = this._users.indexOf(user)
        if (index < 0) {
            this._users.push(user)
        }
        else {
            console.warn("user already exists for addContextListener")
        }
    }

    /**
     * @property canvas
     * @type {HTMLCanvasElement}
     */
    get canvas(): HTMLCanvasElement {
        if (!this._canvas) {
            this.start(document.createElement('canvas'));
        }
        return this._canvas;
    }
    set canvas(canvas: HTMLCanvasElement) {
        throw new Error(readOnly('canvas').message)
    }

    /**
     * @property commands
     * @type {IUnknownArray}
     * @beta
     * @readOnly
     */
    get commands(): IUnknownArray<IContextCommand> {
        this._commands.addRef();
        return this._commands;
    }
    set commands(unused) {
        throw new Error(readOnly('commands').message)
    }

    /**
     * <p>
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     * <p>
     * @method clearColor
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param alpha {number}
     * @return {WebGLRenderer}
     * @chainable
     */
    clearColor(red: number, green: number, blue: number, alpha: number): WebGLRenderer {
        this._commands.pushWeakRef(new WebGLClearColor(red, green, blue, alpha))
        return this
    }

    contextFree(manager: IContextProvider): void {
        // FIXME: Am I really listening?
        this._commands.forEach(function(command: IContextCommand) {
            command.contextFree(manager)
        })
    }

    contextGain(manager: IContextProvider): void {
        this._commands.forEach(function(command: IContextCommand) {
            command.contextGain(manager)
        })
    }

    contextLost() {
        this._commands.forEach(function(command: IContextCommand) {
            command.contextLost()
        })
    }

    /**
     * @method createArrayBuffer
     * @return {ShareableWebGLBuffer}
     */
    createArrayBuffer(): ShareableWebGLBuffer {
        return new ShareableWebGLBuffer(false)
    }

    /**
     * @method createBufferGeometry
     * @param primitive {Primitive}
     * @param [usage] {number}
     * @return {IBufferGeometry}
     */
    createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry {
        mustBeObject('primitive', primitive);
        mustBeInteger('primitive.mode', primitive.mode);
        mustBeArray('primitive.indices', primitive.indices);
        mustBeObject('primitive.attributes', primitive.attributes);
        if (isDefined(usage)) {
            mustSatisfy('usage', isBufferUsage(usage), () => { return `${this._type}.createBufferGeometry` })
        }
        else {
            usage = isDefined(this._gl) ? this._gl.STATIC_DRAW : void 0
        }
        // It's going to get pretty hopeless without a WebGL context.
        // If that's the case, let's just return undefined now before we start allocating useless stuff.
        if (isUndefined(this._gl)) {
            if (core.verbose) {
                console.warn("Impossible to create a buffer geometry without a WebGL context.")
            }
            return void 0
        }

        const mesh: IBufferGeometry = new BufferGeometry(this._gl, this._blocks)

        // TODO: In this use case, the ShareableWebGLBuffer isn't expected to recover it data.
        const indexBuffer: ShareableWebGLBuffer = new ShareableWebGLBuffer(true);
        this.synchronize(indexBuffer)
        indexBuffer.bind();
        if (isDefined(this._gl)) {
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(primitive.indices), usage);
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
            const buffer: ShareableWebGLBuffer = new ShareableWebGLBuffer(false)
            this.synchronize(buffer)
            buffer.bind()
            let vertexAttrib = primitive.attributes[name]
            let data: number[] = vertexAttrib.values
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), usage)
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
        let drawCommand = new DrawElementsCommand(primitive.mode, primitive.indices.length, this._gl.UNSIGNED_SHORT, 0)
        const block = new ElementsBlock(indexBuffer, attributes, drawCommand)
        this._blocks.put(mesh.uuid, block)
        block.release()
        attributes.release()
        indexBuffer.release()
        return mesh
    }

    /**
     * @method createElementArrayBuffer
     * @return {ShareableWebGLBuffer}
     */
    createElementArrayBuffer(): ShareableWebGLBuffer {
        return new ShareableWebGLBuffer(true)
    }

    /**
     * @method createTextureCubeMap
     * @return {ShareableWebGLTexture}
     */
    createTextureCubeMap(): ShareableWebGLTexture {
        return new ShareableWebGLTexture(mustBeContext(this._gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
    }

    /**
     * @method createTexture2D
     * @return {ITexture2D}
     */
    createTexture2D(): ShareableWebGLTexture {
        return new ShareableWebGLTexture(mustBeContext(this._gl, 'createTexture2D()').TEXTURE_2D);
    }

    /**
     * Turns off specific WebGL capabilities for this context.
     * @method disable
     * @param capability {Capability}
     * @return {WebGLRenderer}
     * @chainable
     */
    disable(capability: Capability): WebGLRenderer {
        this._commands.pushWeakRef(new WebGLDisable(capability))
        return this
    }

    /**
     * Turns on specific WebGL capabilities for this context.
     * @method enable
     * @param capability {Capability}
     * @return {WebGLRenderer}
     * @chainable
     */
    enable(capability: Capability): WebGLRenderer {
        this._commands.pushWeakRef(new WebGLEnable(capability))
        return this
    }

    /**
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    get gl(): WebGLRenderingContext {
        if (this._gl) {
            return this._gl;
        }
        else {
            return void 0;
        }
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
    }

    /**
     * @method removeContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    removeContextListener(user: IContextConsumer): void {
        mustBeObject('user', user)
        const index = this._users.indexOf(user)
        if (index >= 0) {
            this._users.splice(index, 1)
        }
    }

    /**
     * @method prolog
     * @return {void}
     */
    prolog(): void {
        const gl = this._gl;
        if (gl) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
    }

    /**
     * @method render
     * @param drawList {IDrawList}
     * @param ambients {Facet[]}
     * @return {void}
     */
    render(drawList: IDrawList, ambients: Facet[]): void {
        const gl = this._gl;
        if (gl) {
            return drawList.draw(ambients);
        }
    }

    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     * @method viewport
     * @param x {number}
     * @param y {number}
     * @param width {number}
     * @param height {number}
     * @return {WebGLRenderer}
     * @chainable
     */
    viewport(x: number, y: number, width: number, height: number): WebGLRenderer {
        const gl = this._gl;
        if (gl) {
            this._gl.viewport(x, y, width, height)
        }
        else {
            console.warn(`${this._type}.viewport() ignored because no context.`)
        }
        return this
    }

    /**
     * Initializes the WebGL context for the specified <code>canvas</code>.
     * @method start
     * @param canvas {HTMLCanvasElement} The HTML canvas element.
     * @return {WebGLRenderer}
     * @chainable
     */
    start(canvas: HTMLCanvasElement): WebGLRenderer {
        if (!(canvas instanceof HTMLCanvasElement)) {
            console.warn("canvas must be an HTMLCanvasElement to start the context.")
            return this
        }
        mustBeDefined('canvas', canvas)
        const alreadyStarted = isDefined(this._canvas);
        if (!alreadyStarted) {
            // cache the arguments
            this._canvas = canvas
        }
        else {
            // We'll just be idempotent and ignore the call because we've already been started.
            // To use the canvas might conflict with one we have dynamically created.
            if (core.verbose) {
                console.warn(`${this._type} Ignoring start() because already started.`)
            }
            return
        }
        // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
        // To not complain is the way of the hyper-functional warrior.
        if (isDefined(this._canvas)) {
            this._gl = initWebGL(this._canvas, this._attributes);
            this.emitStartEvent();
            this._canvas.addEventListener('webglcontextlost', this._webGLContextLost, false)
            this._canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false)
        }
        return this
    }

    /**
     * @method stop
     * @return {WebGLRenderer}
     * @chainable
     */
    stop(): WebGLRenderer {
        if (isDefined(this._canvas)) {
            this._canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false)
            this._canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false)
            if (this._gl) {
                this.emitStopEvent();
                this._gl = void 0;
            }
            this._canvas = void 0;
        }
        return this
    }

    private emitStartEvent() {
        this._blocks.forEach((key, block) => {
            this.emitContextGain(block)
        })
        this._users.forEach((user: IContextConsumer) => {
            this.emitContextGain(user)
        })
        this._commands.forEach((command) => {
            this.emitContextGain(command);
        })
    }

    private emitContextGain(consumer: IContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost();
        }
        else {
            consumer.contextGain(this);
        }
    }

    private emitStopEvent() {
        this._blocks.forEach((key, block) => {
            this.emitContextFree(block)
        })
        this._users.forEach((user: IContextConsumer) => {
            this.emitContextFree(user)
        })
        this._commands.forEach((command) => {
            this.emitContextFree(command);
        })
    }

    private emitContextFree(consumer: IContextConsumer): void {
        if (this._gl.isContextLost()) {
            consumer.contextLost();
        }
        else {
            consumer.contextFree(this);
        }
    }

    /**
     * @method synchronize
     * @param consumer {IContextConsumer}
     * @return {void}
     */
    synchronize(consumer: IContextConsumer): void {
        if (this._gl) {
            this.emitContextGain(consumer);
        }
        else {
            // FIXME: Broken symmetry.
        }
    }
}
