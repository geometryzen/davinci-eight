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
  private _attributes: { [key: string]: ElementsBlockAttrib };
  private _indexBuffer: ArrayBuffer;
  public drawCommand: DrawElementsCommand;
  private _refCount = 1;
  private _uuid: string = uuid4().generate();
  constructor(indexBuffer: ArrayBuffer, attributes: { [key: string]: ElementsBlockAttrib }, drawCommand: DrawElementsCommand) {

    this._indexBuffer = indexBuffer;
    this._indexBuffer.addRef();

    this._attributes = attributes;
    Object.keys(attributes).forEach(function(key: string) {
      attributes[key].addRef();
    });

    this.drawCommand = drawCommand;

    refChange(this._uuid, +1, 'ElementsBlock');
  }
  get indexBuffer() {
    this._indexBuffer.addRef();
    return this._indexBuffer;
  }
  addRef(): number {
    refChange(this._uuid, +1, 'ElementsBlock');
    this._refCount++;
    return this._refCount;
  }
  release(): number {
    refChange(this._uuid, -1, 'ElementsBlock');
    this._refCount--;
    if (this._refCount === 0) {

      let attributes = this._attributes;
      Object.keys(attributes).forEach(function(key: string) {
        attributes[key].release();
      });
      this._attributes = void 0;

      this._indexBuffer.release();
      this._indexBuffer = void 0;

      this.drawCommand = void 0;
      this._uuid = void 0;

      let refCount = this._refCount;
      this._refCount = 0;
      return refCount;
    }
    else {
      return this._refCount;
    }
  }
  get attributes() {
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
      this._buffer = void 0;
      this.size = void 0;
      this.normalized = void 0;
      this.stride = void 0;
      this.offset = void 0;
      this._uuid = void 0;
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

function messageUnrecognizedToken(token: string): string {
  expectArg('token', token).toBeString();
  return token + " is not a recognized token";
}

function assertProgram(argName: string, program: ShaderProgram): void {
  expectArg(argName, program).toBeObject();
}

function attribKey(aName: string, aNameToKeyName?: {[aName: string]: string}): string {
  if (isUndefined(aNameToKeyName)) {
    return aName;
  }
  else {
    let key = aNameToKeyName[aName];
    return isDefined(key) ? key : aName;
  }
}

function contextProxy(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): RenderingContextMonitor {

  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");
  let uuid: string = uuid4().generate();
  let tokenMap: {[name:string]:ElementsBlock} = {};
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

  function drawTokenDelete(uuid: string) {
    return function() {
      let blob = tokenMap[uuid];
      if (isDefined(blob)) {

        let indexBuffer = blob.indexBuffer;
        removeContextUser(indexBuffer);
        indexBuffer.release();
        indexBuffer = void 0;

        Object.keys(blob.attributes).forEach(function(key:string) {
          let attribute = blob.attributes[key];

          let buffer = attribute.buffer;
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
    }
  }

  function drawToken(uuid: string): Mesh {

    let refCount = new RefCount(drawTokenDelete(uuid));
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
          let blob = tokenMap[uuid];
          if (isDefined(blob)) {
            if (isDefined(program)) {

              let indexBuffer = blob.indexBuffer;
              indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
              indexBuffer.release();
              indexBuffer = void 0;

              // FIXME: We're doing a lot of string-based lookup!
              Object.keys(program.attributes).forEach(function(aName: string) {
                let key: string = attribKey(aName, aNameToKeyName);
                let attribute: ElementsBlockAttrib = blob.attributes[key];
                if (isDefined(attribute)) {
                  // Associate the attribute buffer with the attribute location.
                  let buffer = attribute.buffer;
                  try {
                    buffer.bind(context.ARRAY_BUFFER);
                    try {
                      let attributeLocation = program.attributes[aName];
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
      draw(): void {
        let blob = tokenMap[uuid];
        if (isDefined(blob)) {
          blob.drawCommand.execute(context);
        }
        else {
          throw new Error(messageUnrecognizedToken(uuid));
        }
      },
      unbind(): void {
        if (_program) {
          let blob = tokenMap[uuid];
          if (isDefined(blob)) {
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);

            Object.keys(_program.attributes).forEach(function(aName: string) {
              let aLocation = _program.attributes[aName];
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

      let token: Mesh = drawToken(uuid4().generate());

      let indexBuffer = self.vertexBuffer();
      try {
        indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);

        // attributes
        let attributes: { [name: string]: ElementsBlockAttrib } = {};
        try {
          Object.keys(elements.attributes).forEach(function(name: string) {
            let buffer = self.vertexBuffer();
            try {
              buffer.bind(context.ARRAY_BUFFER);
              try {
                let vertexAttrib = elements.attributes[name];
                let data: number[] = vertexAttrib.vector.data;
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
                attributes[name] = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
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
          let drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, 0);
          tokenMap[token.uuid] = new ElementsBlock(indexBuffer, attributes, drawCommand);
        }
        finally {
          Object.keys(attributes).forEach(function(key: string){
            let attribute: ElementsBlockAttrib = attributes[key];
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
        while(users.length > 0) {
          let user = users.pop();
          user.release();
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
