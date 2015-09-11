import ArrayBuffer = require('../core/ArrayBuffer');
import Mesh = require('../dfx/Mesh');
import Elements = require('../dfx/Elements');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
import RenderingContextUser = require('../core/RenderingContextUser');
import initWebGL = require('../renderers/initWebGL');
import IUnknown = require('../core/IUnknown')
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import isUndefined = require('../checks/isUndefined');
import IUnknownMap = require('../utils/IUnknownMap');
import RefCount = require('../utils/RefCount');
import refChange = require('../utils/refChange');
import ShaderProgram = require('../core/ShaderProgram');
import Symbolic = require('../core/Symbolic');
import Texture = require('../resources/Texture');
import VectorN = require('../math/VectorN');
import uuid4 = require('../utils/uuid4');

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
  private _attributes: IUnknownMap<ElementsBlockAttrib>;
  private _indexBuffer: ArrayBuffer;
  public drawCommand: DrawElementsCommand;
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  constructor(indexBuffer: ArrayBuffer, attributes: IUnknownMap<ElementsBlockAttrib>, drawCommand: DrawElementsCommand) {

    this._indexBuffer = indexBuffer;
    this._indexBuffer.addRef();

    this._attributes = attributes;
    this._attributes.addRef();

    this.drawCommand = drawCommand;

    refChange(this._uuid, +1, 'ElementsBlock');
  }
  get indexBuffer(): ArrayBuffer {
    this._indexBuffer.addRef();
    return this._indexBuffer;
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, +1, 'ElementsBlock');
    return this._refCount;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, -1, 'ElementsBlock');
    if (this._refCount === 0) {
      this._attributes.release();
      this._indexBuffer.release();
    }
    return this._refCount;
  }
  get attributes(): IUnknownMap<ElementsBlockAttrib> {
    this._attributes.addRef();
    return this._attributes;
  }
}
class ElementsBlockAttrib implements IUnknown {
  private _buffer: ArrayBuffer;
  public size: number;
  public normalized: boolean;
  public stride: number;
  public offset: number;
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  constructor(buffer: ArrayBuffer, size: number, normalized: boolean, stride: number, offset: number) {
    this._buffer = buffer;
    this._buffer.addRef();
    this.size = size;
    this.normalized = normalized;
    this.stride = stride;
    this.offset = offset;
    refChange(this._uuid, +1, 'ElementsBlockAttrib');
  }
  addRef(): number {
    refChange(this._uuid, +1, 'ElementsBlockAttrib');
    this._refCount++;
    return this._refCount;
  }
  release(): number {
    refChange(this._uuid, -1, 'ElementsBlockAttrib');
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

function isDrawMode(mode: number, context: WebGLRenderingContext): boolean {
  expectArg('mode', mode).toBeNumber();
  switch(mode) {
    case context.TRIANGLES: {
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

function contextProxy(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): RenderingContextMonitor {

  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
  let uuid: string = uuid4().generate();
  let blocks = new IUnknownMap<ElementsBlock>();
  let users: RenderingContextUser[] = [];

  function addContextUser(user: RenderingContextUser): void {
    expectArg('user', user).toBeObject();
    users.push(user);
    user.addRef();
    if (context) {
      user.contextGain(context);
    }
  }

  function removeContextUser(user: RenderingContextUser): void {
    expectArg('user', user).toBeObject();
    let index = users.indexOf(user);
    if (index >= 0) {
      let removals = users.splice(index, 1);
      removals.forEach(function(user){
        user.release();
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

  function createMesh(uuid: string): Mesh {

    let refCount = new RefCount(meshRemover(uuid));
    let _program: ShaderProgram = void 0;
    let self: Mesh = {
      addRef(): number {
        refChange(uuid, +1, 'Mesh');
        return refCount.addRef();
      },
      release(): number {
        refChange(uuid, -1, 'Mesh');
        return refCount.release();
      },
      get uuid() {
        return uuid;
      },
      bind(program: ShaderProgram, aNameToKeyName?: {[name: string]: string}): void {
        if (_program !== program) {
          if (_program) {
            self.unbind();
          }
          let block= blocks.get(uuid);
          if (block) {
            if (program) {
              _program = program;
              _program.addRef();

              let indexBuffer = block.indexBuffer;
              indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
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
                  buffer.bind(context.ARRAY_BUFFER);
                  let attributeLocation = program.attributes[aName];
                  attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
                  buffer.unbind(context.ARRAY_BUFFER);

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
            indexBuffer.unbind(context.ELEMENT_ARRAY_BUFFER);
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
    refChange(uuid, +1, 'Mesh');
    return self;
  }

  var context: WebGLRenderingContext;
  var refCount: number = 1;
  var mirror: boolean = true;
  let tokenArg = expectArg('token', "");

  let webGLContextLost = function(event: Event) {
    event.preventDefault();
    context = void 0;
    users.forEach(function(user: RenderingContextUser) {
      user.contextLoss();
    });
  };

  let webGLContextRestored = function(event: Event) {
    event.preventDefault();
    context = initWebGL(canvas, attributes);
    users.forEach(function(user: RenderingContextUser) {
      user.contextGain(context);
    });
  };

  let self: RenderingContextMonitor = {
    /**
     *
     */
    createMesh(elements: Elements, mode: number, usage?: number): Mesh {
      expectArg('elements', elements).toSatisfy(elements instanceof Elements, "elements must be an instance of Elements");
      expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
      if (isDefined(usage)) {
        expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
      }
      else {
        usage = context.STATIC_DRAW;
      }

      let token: Mesh = createMesh(uuid4().generate());

      let indexBuffer = self.vertexBuffer();
      indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
      context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
      context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);

      let attributes = new IUnknownMap<ElementsBlockAttrib>();
      let names = Object.keys(elements.attributes);
      let namesLength = names.length;
      var i: number;
      for (i = 0; i < namesLength; i++) {
        let name = names[i];
        let buffer = self.vertexBuffer();
        buffer.bind(context.ARRAY_BUFFER);
        let vertexAttrib = elements.attributes[name];
        let data: number[] = vertexAttrib.vector.data;
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
        let attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
        attributes.put(name, attribute);
        attribute.release();
        buffer.unbind(context.ARRAY_BUFFER);
        buffer.release();
      }
      // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
      // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
      let drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, 0);
      let block = new ElementsBlock(indexBuffer, attributes, drawCommand);
      blocks.put(token.uuid, block);
      block.release();
      attributes.release();
      indexBuffer.release();
      return token;
    },
    start(): RenderingContextMonitor {
      context = initWebGL(canvas, attributes);
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      users.forEach(function(user: RenderingContextUser) {user.contextGain(context);});
      return self;
    },
    stop(): RenderingContextMonitor {
      context = void 0;
      users.forEach(function(user: RenderingContextUser) {user.contextFree();});
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
      return self;
    },
    addContextUser(user: RenderingContextUser): RenderingContextMonitor {
      addContextUser(user);
      return self;
    },
    removeContextUser(user: RenderingContextUser): RenderingContextMonitor {
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
    addRef(): number {
      refChange(uuid, +1, 'RenderingContextMonitor');
      refCount++;
      return refCount;
    },
    release(): number {
      refChange(uuid, -1, 'RenderingContextMonitor');
      refCount--;
      if (refCount === 0) {
        blocks.release();
        // TODO: users should be an IUnknownArray
        while(users.length > 0) {
          let user = users.pop();
          user.release();
        }
        // easier users.release();
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
    texture(): Texture {
      let texture = new Texture(self);
      self.addContextUser(texture);
      return texture;
    },
    vertexBuffer(): ArrayBuffer {
      let vbo = new ArrayBuffer(self);
      self.addContextUser(vbo);
      return vbo;
    },
    get mirror() {
      return mirror;
    },
    set mirror(value: boolean) {
      mirror = expectArg('mirror', value).toBeBoolean().value;
    }
  };
  refChange(uuid, +1, 'RenderingContextMonitor');
  return self;
}

export = contextProxy;
