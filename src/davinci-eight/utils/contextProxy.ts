import BufferResource = require('../core/BufferResource')
import ContextKahuna = require('../core/ContextKahuna')
import ContextManager = require('../core/ContextManager')
import ContextListener = require('../core/ContextListener')
import core = require('../core')
import GeometryData = require('../dfx/GeometryData')
import expectArg = require('../checks/expectArg')
import initWebGL = require('../renderers/initWebGL')
import IBuffer = require('../core/IBuffer')
import IBufferGeometry = require('../dfx/IBufferGeometry')
import isDefined = require('../checks/isDefined')
import isNumber = require('../checks/isNumber')
import isUndefined = require('../checks/isUndefined')
import ITexture = require('../core/ITexture')
import IUnknown = require('../core/IUnknown')
import IMaterial = require('../core/IMaterial')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeString = require('../checks/mustBeString')
import randumbInteger = require('../utils/randumbInteger');
import RefCount = require('../utils/RefCount')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import Simplex = require('../dfx/Simplex')
import StringIUnknownMap = require('../utils/StringIUnknownMap')
import Symbolic = require('../core/Symbolic')
import TextureResource = require('../resources/TextureResource')
import uuid4 = require('../utils/uuid4')
import VectorN = require('../math/VectorN')

let LOGGING_NAME_ELEMENTS_BLOCK = 'ElementsBlock'
let LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib'
let LOGGING_NAME_MESH = 'Mesh'

let LOGGING_NAME_KAHUNA = 'ContextKahuna'

function webglFunctionalConstructorContextBuilder(): string {
  // The following string represents how this API is exposed.
  return "webgl functional constructor"
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
 * This could become an encapsulated call?
 * class GeometryDataCommand
 * private
 */
class GeometryDataCommand {
  /**
   * property mode
   * type {number}
   * private
   */
  private mode: number;
  private count: number;
  private type: number;
  private offset: number;
  /**
   * class GeometryDataCommand
   * constructor
   */
  constructor(mode: number, count: number, type: number, offset: number) {
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
  execute(gl: WebGLRenderingContext) {
    if (isDefined(gl)) {
      gl.drawElements(this.mode, this.count, this.type, this.offset);
    }
    else {
      console.warn("HFW: Er, like hey dude! You're asking me to draw something without a context. That's not cool, but I won't complain.")
    }
  }
}

/**
 * class ElementsBlock
 */
class ElementsBlock extends Shareable {
  // FIXME: Need to convert this into a IUnknownArray
  // Can we know our IMaterial(s)?
  /**
   * Mapping from attribute name to a data structure describing and containing a buffer.
   * property _attributes
   * type {StringIUnknownMap<ElementBlockAttrib>}
   * private
   */
  private _attributes: StringIUnknownMap<ElementsBlockAttrib>;
  /**
   * The buffer containing element indices used in the drawElements command.
   * property _indexBuffer
   * type {IBuffer}
   * private
   */
  private _indexBuffer: IBuffer;
  /**
   * An executable command. May be a call to drawElements or drawArrays.
   * property drawCommand
   * type {GeometryDataCommand}
   */
  public drawCommand: GeometryDataCommand;
  /**
   * class ElementsBlock
   * constructor
   */
  constructor(indexBuffer: IBuffer, attributes: StringIUnknownMap<ElementsBlockAttrib>, drawCommand: GeometryDataCommand) {
    super(LOGGING_NAME_ELEMENTS_BLOCK);
    this._indexBuffer = indexBuffer;
    this._indexBuffer.addRef();
    this._attributes = attributes;
    this._attributes.addRef();
    this.drawCommand = drawCommand;
  }
  destructor(): void {
    this._attributes.release();
    this._attributes = void 0;
    this._indexBuffer.release();
    this._indexBuffer = void 0;
  }
  get indexBuffer(): IBuffer {
    this._indexBuffer.addRef();
    return this._indexBuffer;
  }
  get attributes(): StringIUnknownMap<ElementsBlockAttrib> {
    this._attributes.addRef();
    return this._attributes;
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
  get buffer() {
    this._buffer.addRef();
    return this._buffer;
  }
}

// TODO: If mode provided, check consistent with elements.k.
// expectArg('mode', mode).toSatisfy(isDrawMode(mode, gl), "mode must be one of TRIANGLES, ...");
function drawMode(k: number, mode: number): number {
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

function isDrawMode(mode: number): boolean {
  mustBeNumber('mode', mode);
  switch(mode) {
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

function isBufferUsage(usage: number): boolean {
  mustBeNumber('usage', usage);
  switch(usage) {
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

function attribKey(aName: string, aNameToKeyName?: {[aName: string]: string}): string {
  if (aNameToKeyName) {
    let key = aNameToKeyName[aName];
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
function bindProgramAttribLocations(program: IMaterial, block: ElementsBlock, aNameToKeyName?: {[name: string]: string}) {
  // FIXME: Expecting canvasId here.
  // FIXME: This is where we get the IMaterial attributes property.
  // FIXME: Can we invert this?
  // What are we offering to the program:
  // block.attributes (reference counted)
  // Offer a NumberIUnknownList<IAttributePointer> which we have prepared up front
  // in order to get the name -> index correct.
  // Then attribute setting shoul go much faster
  let attribLocations = program.attributes;
  if (attribLocations) {
    let aNames = Object.keys(attribLocations);
    let aNamesLength = aNames.length;
    var i: number;
    for (i = 0; i < aNamesLength; i++) {
      let aName = aNames[i];
      let key: string = attribKey(aName, aNameToKeyName);
      let attributes = block.attributes;
      let attribute = attributes.getWeakReference(key);
      if (attribute) {
        // Associate the attribute buffer with the attribute location.
        // FIXME Would be nice to be able to get a weak reference to the buffer.
        let buffer = attribute.buffer;
        buffer.bind();
        let attributeLocation = attribLocations[aName];
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
    console.warn("bindProgramAttribLocations: program.attributes is falsey.")
  }
}

function unbindProgramAttribLocations(program: IMaterial) {
  // FIXME: Not sure if this suggests a disableAll() or something more symmetric.
  let attribLocations = program.attributes;
  if (attribLocations) {
    Object.keys(attribLocations).forEach(function(aName: string) {
      attribLocations[aName].disable();
    });
  }
  else {
    console.warn("unbindProgramAttribLocations: program.attributes is falsey.")
  }
}

function webgl(attributes?: WebGLContextAttributes): ContextKahuna {
  // expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
  // mustBeInteger('canvasId', canvasId, webglFunctionalConstructorContextBuilder);
  let uuid: string = uuid4().generate();
  let blocks = new StringIUnknownMap<ElementsBlock>();
  // Remark: We only hold weak references to users so that the lifetime of resource
  // objects is not affected by the fact that they are listening for gl events.
  // Users should automatically add themselves upon construction and remove upon release.
  // // FIXME: Really? Not IUnknownArray<IContextListener> ?
  let users: ContextListener[] = [];

  function addContextListener(user: ContextListener): void {
    expectArg('user', user).toBeObject();
    users.push(user);
    if (gl) {
      user.contextGain(kahuna);
    }
  }

  function removeContextListener(user: ContextListener): void {
    expectArg('user', user).toBeObject();
    let index = users.indexOf(user);
    if (index >= 0) {
      let removals = users.splice(index, 1);
      removals.forEach(function(user: ContextListener){
        // What's going on here?
      });
    }
  }

  function meshRemover(blockUUID: string) {
    return function() {
      if (blocks.exists(blockUUID)) {
        blocks.remove(blockUUID);
      }
      else {
        console.warn("[System Error] " + messageUnrecognizedMesh(blockUUID));
      }
    }
  }

  function createBufferGeometry(uuid: string): IBufferGeometry {

    let refCount = new RefCount(meshRemover(uuid));
    let _program: IMaterial = void 0;
    let mesh: IBufferGeometry = {
      addRef(): number {
        refChange(uuid, LOGGING_NAME_MESH, +1);
        return refCount.addRef();
      },
      release(): number {
        refChange(uuid, LOGGING_NAME_MESH, -1);
        return refCount.release();
      },
      get uuid() {
        return uuid;
      },
      bind(program: IMaterial, aNameToKeyName?: {[name: string]: string}): void {
        if (_program !== program) {
          if (_program) {
            mesh.unbind();
          }
          let block= blocks.getWeakReference(uuid);
          if (block) {
            if (program) {
              _program = program;
              _program.addRef();

              let indexBuffer = block.indexBuffer;
              indexBuffer.bind();
              indexBuffer.release();

              bindProgramAttribLocations(_program, block, aNameToKeyName);
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
      draw(): void {
        let block = blocks.getWeakReference(uuid);
        if (block) {
          block.drawCommand.execute(gl);
        }
        else {
          throw new Error(messageUnrecognizedMesh(uuid));
        }
      },
      unbind(): void {
        if (_program) {
          let block = blocks.getWeakReference(uuid);
          if (block) {
            // FIXME: Ask block to unbind index buffer and avoid addRef/release
            let indexBuffer = block.indexBuffer;
            indexBuffer.unbind();
            indexBuffer.release();
            unbindProgramAttribLocations(_program);
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
  var gl: WebGLRenderingContext;
  /**
   * We must cache the canvas so that we can remove listeners when `stop() is called.
   * Only between `start()` and `stop()` is canvas defined.
   * We use a canvasBuilder so the other initialization can happen while we are waiting
   * for the DOM to load. 
   */
  var _canvasElement: HTMLCanvasElement;
  var _canvasId: number;
  var refCount: number = 1;
  var mirror: boolean = false;
  let tokenArg = expectArg('token', "");

  let webGLContextLost = function(event: Event) {
    if (isDefined(_canvasElement)) {
      event.preventDefault()
      gl = void 0
      users.forEach(function(user: ContextListener) {
        user.contextLoss(_canvasId)
      })
    }
  }

  let webGLContextRestored = function(event: Event) {
    if (isDefined(_canvasElement)) {
      event.preventDefault()
      gl = initWebGL(_canvasElement, attributes)
      users.forEach(function(user: ContextListener) {
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
    createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry {
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
        // No usage may be OK. After all it's just a hint!
      }
      // It's going to get pretty hopeless without a WebGL context.
      // If that's the case, let's just return undefined now before we start allocating useless stuff.
      if (isUndefined(gl)) {
        if (core.verbose) {
          console.warn("Impossible to create a buffer geometry without a WebGL context. Sorry, no dice!");
        }
        return void 0;
      }

      let mesh: IBufferGeometry = createBufferGeometry(uuid4().generate());

      let indexBuffer = kahuna.createElementArrayBuffer();
      indexBuffer.bind();
      if (isDefined(gl)) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
      }
      else {
        console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.")
      }
      indexBuffer.unbind();

      // FIXME: Advanced. Being able to set an initial reference count would allow me to save a release?
      let attributes = new StringIUnknownMap<ElementsBlockAttrib>();
      let names = Object.keys(elements.attributes);
      let namesLength = names.length;
      var i: number;
      for (i = 0; i < namesLength; i++) {
        let name = names[i];
        let buffer = kahuna.createArrayBuffer();
        buffer.bind();
        let vertexAttrib = elements.attributes[name];
        let data: number[] = vertexAttrib.values.data;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
        let attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
        attributes.putWeakReference(name, attribute);
        buffer.unbind();
        buffer.release();
      }
      // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
      // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
      switch(elements.k) {

      }
      let drawCommand = new GeometryDataCommand(mode, elements.indices.length, gl.UNSIGNED_SHORT, 0)
      blocks.putWeakReference(mesh.uuid, new ElementsBlock(indexBuffer, attributes, drawCommand))
      attributes.release()
      indexBuffer.release()
      return mesh;
    },
    start(canvasElement: HTMLCanvasElement, canvasId: number): void {
      let alreadyStarted = isDefined(_canvasElement);
      if (!alreadyStarted) {
        // cache the arguments
        _canvasElement = canvasElement
        _canvasId = canvasId
      }
      else {
        // We'll assert that if we have a canvas element then we should have a canvas id.
        mustBeInteger('_canvasId', _canvasId);
        // We'll just be idempotent and ignore the call because we've already been started.
        // To use the canvasElement might conflict with one we have dynamically created.
        if (core.verbose) {
          console.warn("Ignoring `start()` because already started.")
        }
        return
      }
      // What if we were given a "no-op" canvasBuilder that returns undefined for the canvas.
      // To not complain is the way of the hyper-functional warrior.
      if (isDefined(_canvasElement)) {
        gl = initWebGL(_canvasElement, attributes);
        _canvasElement.addEventListener('webglcontextlost', webGLContextLost, false)
        _canvasElement.addEventListener('webglcontextrestored', webGLContextRestored, false)
        users.forEach(function(user: ContextListener) { user.contextGain(kahuna) })
      }
    },
    stop(): void {
      if (isDefined(_canvasElement)) {
        gl = void 0
        users.forEach(function(user: ContextListener) { user.contextFree(_canvasId) })
        _canvasElement.removeEventListener('webglcontextrestored', webGLContextRestored, false)
        _canvasElement.removeEventListener('webglcontextlost', webGLContextLost, false)
        _canvasElement = void 0;
        _canvasId = void 0;
      }
    },
    addContextListener(user: ContextListener): void {
      addContextListener(user);
    },
    removeContextListener(user: ContextListener): void {
      removeContextListener(user);
    },
    get canvasElement(): HTMLCanvasElement {
      if (!_canvasElement) {
        // Interesting little side-effect!
        // Love the way kahuna talks in the third person.
        kahuna.start(document.createElement('canvas'), randumbInteger());
        }
      return _canvasElement;
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
        blocks.release();
        while(users.length > 0) {
          let user = users.pop();
        }
      }
      return refCount;
    },
    clearColor(red: number, green: number, blue: number, alpha: number): void {
      if (gl) {
        return gl.clearColor(red, green, blue, alpha);
      }
    },
    clearDepth(depth: number): void {
      if (gl) {
        return gl.clearDepth(depth);
      }
    },
    drawArrays(mode: number, first: number, count: number): void {
      if (gl) {
        return gl.drawArrays(mode, first, count);
      }
    },
    drawElements(mode: number, count: number, type: number, offset: number): void {
      if (gl) {
        return gl.drawElements(mode, count, type, offset);
      }
    },
    depthFunc(func: number): void {
      if (gl) {
        return gl.depthFunc(func);
      }
    },
    enable(capability: number): void {
      if (gl) {
        return gl.enable(capability);
      }
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
      // FIXME Does this mean that Texture only has one ContextMonitor?
      return new TextureResource([kahuna], mustBeContext(gl, 'createTexture2D()').TEXTURE_2D);
    },
    createTextureCubeMap(): ITexture {
      // TODO: Replace with functional constructor pattern.
      return new TextureResource([kahuna], mustBeContext(gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
    },
    get mirror() {
      return mirror;
    },
    set mirror(value: boolean) {
      mirror = expectArg('mirror', value).toBeBoolean().value;
    }
  };
  refChange(uuid, LOGGING_NAME_KAHUNA, +1);
  return kahuna;
}

export = webgl;
