import BufferResource = require('../core/BufferResource');
import ContextKahuna = require('../core/ContextKahuna');
import ContextManager = require('../core/ContextManager');
import ContextListener = require('../core/ContextListener');
import DrawElements = require('../dfx/DrawElements');
import expectArg = require('../checks/expectArg');
import initWebGL = require('../renderers/initWebGL');
import IBuffer = require('../core/IBuffer');
import IMesh = require('../dfx/IMesh');
import isDefined = require('../checks/isDefined');
import isNumber = require('../checks/isNumber');
import isUndefined = require('../checks/isUndefined');
import ITexture = require('../core/ITexture');
import IUnknown = require('../core/IUnknown')
import IProgram = require('../core/IProgram');
import mustBeInteger = require('../checks/mustBeInteger');
import RefCount = require('../utils/RefCount');
import refChange = require('../utils/refChange');
import Simplex = require('../dfx/Simplex');
import StringIUnknownMap = require('../utils/StringIUnknownMap');
import Symbolic = require('../core/Symbolic');
import TextureResource = require('../resources/TextureResource');
import uuid4 = require('../utils/uuid4');
import VectorN = require('../math/VectorN');

let LOGGING_NAME_ELEMENTS_BLOCK = 'ElementsBlock';
let LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE = 'ElementsBlockAttrib';
let LOGGING_NAME_MESH = 'Mesh';

let LOGGING_NAME_KAHUNA = 'ContextKahuna';

function webglFunctionalConstructorContextBuilder(): string {
  // The following string represents how this API is exposed.
  return "webgl functional constructor";
}

function mustBeContext(context: WebGLRenderingContext, method: string): WebGLRenderingContext {
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
class DrawElementsCommand {
  private mode: number;
  private count: number;
  private type: number;
  private offset: number;
  constructor(mode: number, count: number, type: number, offset: number) {
    this.mode = mode;
    this.count = count;
    this.type = type;
    this.offset = offset;
  }
  execute(context: WebGLRenderingContext) {
    context.drawElements(this.mode, this.count, this.type, this.offset);
  }
}

class ElementsBlock implements IUnknown {
  private _attributes: StringIUnknownMap<ElementsBlockAttrib>;
  private _indexBuffer: IBuffer;
  public drawCommand: DrawElementsCommand;
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  constructor(indexBuffer: IBuffer, attributes: StringIUnknownMap<ElementsBlockAttrib>, drawCommand: DrawElementsCommand) {

    this._indexBuffer = indexBuffer;
    this._indexBuffer.addRef();

    this._attributes = attributes;
    this._attributes.addRef();

    this.drawCommand = drawCommand;

    refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, +1);
  }
  get indexBuffer(): IBuffer {
    this._indexBuffer.addRef();
    return this._indexBuffer;
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, +1);
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK, -1);
    if (this._refCount === 0) {
      this._attributes.release();
      this._indexBuffer.release();
    }
    return this._refCount;
  }
  get attributes(): StringIUnknownMap<ElementsBlockAttrib> {
    this._attributes.addRef();
    return this._attributes;
  }
}

/**
 *
 */
class ElementsBlockAttrib implements IUnknown {
  private _buffer: IBuffer;
  public size: number;
  public normalized: boolean;
  public stride: number;
  public offset: number;
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  constructor(buffer: IBuffer, size: number, normalized: boolean, stride: number, offset: number) {
    this._buffer = buffer;
    this._buffer.addRef();
    this.size = size;
    this.normalized = normalized;
    this.stride = stride;
    this.offset = offset;
    refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, +1);
  }
  addRef(): number {
    refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, +1);
    this._refCount++;
    return this._refCount;
  }
  release(): number {
    refChange(this._uuid, LOGGING_NAME_ELEMENTS_BLOCK_ATTRIBUTE, -1);
    this._refCount--;
    if (this._refCount === 0) {
      this._buffer.release();
    }
    return this._refCount;
  }
  get buffer() {
    this._buffer.addRef();
    return this._buffer;
  }
}

// TODO: If mode provided, check consistent with elements.k.
// expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
function drawMode(k: number, mode: number, context: WebGLRenderingContext): number {
  switch(k) {
    case Simplex.K_FOR_TRIANGLE: {
      return context.TRIANGLES;
    }
    case Simplex.K_FOR_LINE_SEGMENT: {
      return context.LINES;
    }
    case Simplex.K_FOR_POINT: {
      return context.POINTS;
    }
    case Simplex.K_FOR_EMPTY: {
      return void 0;
    }
    default: {
      throw new Error("Unexpected k-simplex dimension, k => " + k);
    }
  }
}

function isDrawMode(mode: number, context: WebGLRenderingContext): boolean {
  if (!isNumber(mode)) {
    expectArg('mode', mode).toBeNumber();
  }
  switch(mode) {
    case context.TRIANGLES: {
      return true;
    }
    case context.LINES: {
      return true;
    }
    case context.POINTS: {
      return true;
    }
    default: {
      return false;
    }
  }
}

function isBufferUsage(usage: number, context: WebGLRenderingContext): boolean {
  expectArg('usage', usage).toBeNumber();
  switch(usage) {
    case context.STATIC_DRAW: {
      return true;
    }
    default: {
      return false;
    }
  }
}

function messageUnrecognizedMesh(meshUUID: string): string {
  expectArg('meshUUID', meshUUID).toBeString();
  return meshUUID + " is not a recognized mesh uuid";
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

function webgl(canvas: HTMLCanvasElement, canvasId: number = 0, attributes?: WebGLContextAttributes): ContextKahuna {
  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement @ webgl function");
  mustBeInteger('canvasId', canvasId, webglFunctionalConstructorContextBuilder);
  let uuid: string = uuid4().generate();
  let blocks = new StringIUnknownMap<ElementsBlock>();
  // Remark: We only hold weak references to users so that the lifetime of resource
  // objects is not affected by the fact that they are listening for context events.
  // Users should automatically add themselves upon construction and remove upon release.
  let users: ContextListener[] = [];

  function addContextListener(user: ContextListener): void {
    expectArg('user', user).toBeObject();
    users.push(user);
    if (context) {
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

  function createDrawElementsMesh(uuid: string): IMesh {

    let refCount = new RefCount(meshRemover(uuid));
    let _program: IProgram = void 0;
    let mesh: IMesh = {
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
      bind(program: IProgram, aNameToKeyName?: {[name: string]: string}): void {
        if (_program !== program) {
          if (_program) {
            mesh.unbind();
          }
          let block= blocks.get(uuid);
          if (block) {
            if (program) {
              _program = program;
              _program.addRef();

              let indexBuffer = block.indexBuffer;
              indexBuffer.bind();
              indexBuffer.release();

              let aNames = Object.keys(program.attributes);
              let aNamesLength = aNames.length;
              var aNamesIndex: number;
              for (aNamesIndex = 0; aNamesIndex < aNamesLength; aNamesIndex++) {
                let aName = aNames[aNamesIndex];
                let key: string = attribKey(aName, aNameToKeyName);
                let attributes = block.attributes;
                let attribute = attributes.get(key);
                if (attribute) {
                  // Associate the attribute buffer with the attribute location.
                  let buffer = attribute.buffer;
                  buffer.bind();
                  let attributeLocation = program.attributes[aName];
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
              expectArg('program', program).toBeObject();
            }
            block.release();
          }
          else {
            throw new Error(messageUnrecognizedMesh(uuid));
          }
        }
      },
      draw(): void {
        let block = blocks.get(uuid);
        if (block) {
          block.drawCommand.execute(context);
          block.release();
        }
        else {
          throw new Error(messageUnrecognizedMesh(uuid));
        }
      },
      unbind(): void {
        if (_program) {
          let block = blocks.get(uuid);
          if (block) {
            let indexBuffer = block.indexBuffer;
            indexBuffer.unbind();
            indexBuffer.release();

            Object.keys(_program.attributes).forEach(function(aName: string) {
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

  var context: WebGLRenderingContext;
  var refCount: number = 1;
  var mirror: boolean = false;
  let tokenArg = expectArg('token', "");

  let webGLContextLost = function(event: Event) {
    event.preventDefault();
    context = void 0;
    users.forEach(function(user: ContextListener) {
      user.contextLoss(canvasId);
    });
  };

  let webGLContextRestored = function(event: Event) {
    event.preventDefault();
    context = initWebGL(canvas, attributes);
    users.forEach(function(user: ContextListener) {
      user.contextGain(kahuna);
    });
  };

  var kahuna: ContextKahuna = {
    get canvasId(): number {
      return canvasId;
    },
    /**
     *
     */
    createDrawElementsMesh(elements: DrawElements, mode?: number, usage?: number): IMesh {
      expectArg('elements', elements).toSatisfy(elements instanceof DrawElements, "elements must be an instance of DrawElements");
      mode = drawMode(elements.k, mode, context);
      if (!isDefined(mode)) {
        // An empty simplex (k = -1 or vertices.length = k + 1 = 0) begets
        // something that can't be drawn (no mode) and it is invisible anyway.
        // In such a case we choose not to allocate any buffers. What would be the usage?
        return void 0;
      }
      if (isDefined(usage)) {
        expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
      }
      else {
        usage = context.STATIC_DRAW;
      }

      let mesh: IMesh = createDrawElementsMesh(uuid4().generate());

      let indexBuffer = kahuna.createElementArrayBuffer();
      indexBuffer.bind();
      context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
      indexBuffer.unbind();

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
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
        let attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
        attributes.put(name, attribute);
        attribute.release();
        buffer.unbind();
        buffer.release();
      }
      // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
      // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
      switch(elements.k) {

      }
      let drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, 0);
      let block = new ElementsBlock(indexBuffer, attributes, drawCommand);
      blocks.put(mesh.uuid, block);
      block.release();
      attributes.release();
      indexBuffer.release();
      return mesh;
    },
    start(): void {
      context = initWebGL(canvas, attributes);
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      users.forEach(function(user: ContextListener) {user.contextGain(kahuna);});
    },
    stop(): void {
      context = void 0;
      users.forEach(function(user: ContextListener) {user.contextFree(canvasId);});
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
    },
    addContextListener(user: ContextListener): void {
      addContextListener(user);
    },
    removeContextListener(user: ContextListener): void {
      removeContextListener(user);
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
    addRef(): number {
      refChange(uuid, LOGGING_NAME_KAHUNA, +1);
      refCount++;
      return refCount;
    },
    release(): number {
      refChange(uuid, LOGGING_NAME_KAHUNA, -1);
      refCount--;
      if (refCount === 0) {
        blocks.release();
        while(users.length > 0) {
          let user = users.pop();
        }
      }
      return refCount;
    },
    clearColor(red: number, green: number, blue: number, alpha: number): void {
      if (context) {
        return context.clearColor(red, green, blue, alpha);
      }
    },
    clearDepth(depth: number): void {
      if (context) {
        return context.clearDepth(depth);
      }
    },
    drawArrays(mode: number, first: number, count: number): void {
      if (context) {
        return context.drawArrays(mode, first, count);
      }
    },
    drawElements(mode: number, count: number, type: number, offset: number): void {
      if (context) {
        return context.drawElements(mode, count, type, offset);
      }
    },
    depthFunc(func: number): void {
      if (context) {
        return context.depthFunc(func);
      }
    },
    enable(capability: number): void {
      if (context) {
        return context.enable(capability);
      }
    },
    createArrayBuffer(): IBuffer {
      // TODO: Replace with functional constructor pattern.
      return new BufferResource(kahuna, mustBeContext(context, 'createArrayBuffer()').ARRAY_BUFFER);
    },
    createElementArrayBuffer(): IBuffer {
      // TODO: Replace with functional constructor pattern.
      return new BufferResource(kahuna, mustBeContext(context, 'createElementArrayBuffer()').ELEMENT_ARRAY_BUFFER);
    },
    createTexture2D(): ITexture {
      // TODO: Replace with functional constructor pattern.
      // FIXME Does this mean that Texture only has one ContextMonitor?
      return new TextureResource([kahuna], mustBeContext(context, 'createTexture2D()').TEXTURE_2D);
    },
    createTextureCubeMap(): ITexture {
      // TODO: Replace with functional constructor pattern.
      return new TextureResource([kahuna], mustBeContext(context, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
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
