import ArrayBuffer = require('../core/ArrayBuffer');
import Elements = require('../dfx/Elements');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
import RenderingContextUser = require('../core/RenderingContextUser');
import initWebGL = require('../renderers/initWebGL');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import isUndefined = require('../checks/isUndefined');
import ShaderProgram = require('../core/ShaderProgram');
import Symbolic = require('../core/Symbolic');
import Texture = require('../resources/Texture');
import VectorN = require('../math/VectorN');

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

class ElementsBlock {
  public attributes: { [key: string]: ElementsBlockAttrib };
  public indices: ArrayBuffer;
  public drawCommand: DrawElementsCommand;
  constructor(indices: ArrayBuffer, attributes: { [key: string]: ElementsBlockAttrib }, drawCommand: DrawElementsCommand) {
    this.indices = indices;
    this.attributes = attributes;
    this.drawCommand = drawCommand;
  }
}
class ElementsBlockAttrib {
  public buffer: ArrayBuffer;
  public size: number;
  public normalized: boolean;
  public stride: number;
  public offset: number;
  constructor(buffer: ArrayBuffer, size: number, normalized: boolean, stride: number, offset: number) {
    this.buffer = buffer;
    this.size = size;
    this.normalized = normalized;
    this.stride = stride;
    this.offset = offset;
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

function attribName(name: string, attribMap?: {[name:string]:string}): string {
  if (isUndefined(attribMap)) {
    return name;
  }
  else {
    let alias = attribMap[name];
    return isDefined(alias) ? alias : name;
  }
}

function contextProxy(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): RenderingContextMonitor {

  expectArg('canvas', canvas).toSatisfy(canvas instanceof HTMLCanvasElement, "canvas argument must be an HTMLCanvasElement");

  let users: RenderingContextUser[] = [];
  var context: WebGLRenderingContext;
  var refCount: number = 1;
  var mirror: boolean = true;
  let tokenMap: {[name:string]:ElementsBlock} = {};
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

  var self: RenderingContextMonitor = {
    /**
     *
     */
    checkIn(elements: Elements, mode: number, usage?: number): string {
      expectArg('elements', elements).toSatisfy(elements instanceof Elements, "elements must be an instance of Elements");
      expectArg('mode', mode).toSatisfy(isDrawMode(mode, context), "mode must be one of TRIANGLES, ...");
      if (isDefined(usage)) {
        expectArg('usage', usage).toSatisfy(isBufferUsage(usage, context), "usage must be on of STATIC_DRAW, ...");
      }
      else {
        usage = context.STATIC_DRAW;
      }
      let token: string = Math.random().toString();
      let indexBuffer = self.vertexBuffer();
      indexBuffer.bind(context.ELEMENT_ARRAY_BUFFER);
      context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
      context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
      // attributes
      let attributes: { [name: string]: ElementsBlockAttrib } = {};
      Object.keys(elements.attributes).forEach(function(name: string) {
        let buffer = self.vertexBuffer();
        buffer.bind(context.ARRAY_BUFFER);
        let vertexAttrib = elements.attributes[name];
        let data: number[] = vertexAttrib.vector.data;
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), usage);
        context.bindBuffer(context.ARRAY_BUFFER, null);
        // normalized, stride and offset in future may not be zero.
        attributes[name] = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
      });
      // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
      // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
      let offset = 0; // Later we may set this differently if we reuse buffers.
      let drawCommand = new DrawElementsCommand(mode, elements.indices.length, context.UNSIGNED_SHORT, offset);
      tokenMap[token] = new ElementsBlock(indexBuffer, attributes, drawCommand);
      return token;
    },
    setUp(token: string, program: ShaderProgram, attribMap?: {[name:string]:string}): void {
      let blob = tokenMap[token];
      if (isDefined(blob)) {
        if (isDefined(program)) {
          let indices = blob.indices;
          indices.bind(context.ELEMENT_ARRAY_BUFFER);

          // FIXME: Probably better to work from the program attributes?
          Object.keys(blob.attributes).forEach(function(key: string) {
            let aName: string = attribName(key, attribMap);
            let aLocation = program.attributes[aName];
            if (isDefined(aLocation)) {
              let attribute: ElementsBlockAttrib = blob.attributes[key];
              attribute.buffer.bind(context.ARRAY_BUFFER);
              aLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
              context.bindBuffer(context.ARRAY_BUFFER, null);
            }
            else {
              // The attribute available may not be required by the program.
              // TODO: (1) Named programs, (2) disable warning by attribute.
              // console.warn("attribute " + aName + " is not being used by the program");
            }
          });
        }
        else {
          assertProgram('program', program);
        }
      }
      else {
        throw new Error(messageUnrecognizedToken(token));
      }
    },
    draw(token: string): void {
      let blob = tokenMap[token];
      if (isDefined(blob)) {
        blob.drawCommand.execute(context);
      }
      else {
        throw new Error(messageUnrecognizedToken(token));
      }
    },
    tearDown(token: string, program: ShaderProgram): void {
      let blob = tokenMap[token];
      if (isDefined(blob)) {
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
      }
      else {
        throw new Error(messageUnrecognizedToken(token));
      }
    },
    checkOut(token: string): void {
      let blob = tokenMap[token];
      if (isDefined(blob)) {
        let indices = blob.indices;
        self.removeContextUser(indices);
        Object.keys(blob.attributes).forEach(function(key:string) {
          let attribute = blob.attributes[key];
          let buffer = attribute.buffer;
          self.removeContextUser(buffer);
        });
        delete tokenMap[token];
      }
      else {
        throw new Error(messageUnrecognizedToken(token));
      }
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
      expectArg('user', user).toBeObject();
      user.addRef();
      users.push(user);
      if (context) {
        user.contextGain(context)
      }
      return self;
    },
    removeContextUser(user: RenderingContextUser): RenderingContextMonitor {
      expectArg('user', user).toBeObject();
      let index = users.indexOf(user);
      if (index >= 0) {
        users.splice(index, 1);
        user.release();
      }
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
      refCount++;
      // console.log("monitor.addRef() => " + refCount);
      return refCount;
    },
    release(): number {
      refCount--;
      // console.log("monitor.release() => " + refCount);
      if (refCount === 0) {
        while(users.length > 0) {
          users.pop().release();
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
  return self;
}

export = contextProxy;
