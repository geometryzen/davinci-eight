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

class ElementBlob {
  public elements: Elements;
  public indices: ArrayBuffer;
  public positions: ArrayBuffer;
  public drawMode: number;
  public drawType: number;
  constructor(elements: Elements, indices: ArrayBuffer, positions: ArrayBuffer, drawMode: number, drawType: number) {
    this.elements = elements;
    this.indices = indices;
    this.positions = positions;
    this.drawMode = drawMode;
    this.drawType = drawType;
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
  let tokenMap: {[name:string]:ElementBlob} = {};
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
      // indices
      let indices = self.vertexBuffer();
      indices.bind(context.ELEMENT_ARRAY_BUFFER);
      context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements.indices.data), usage);
      context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
      // attributes
      let positions = self.vertexBuffer();
      positions.bind(context.ARRAY_BUFFER);
      // TODO: Here we are looking for the attribute in a specific location, but later data-driven.
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(elements.attributes[Symbolic.ATTRIBUTE_POSITION].data), usage);
      context.bindBuffer(context.ARRAY_BUFFER, null);
      // Use UNSIGNED_BYTE  if ELEMENT_ARRAY_BUFFER is a Uint8Array.
      // Use UNSIGNED_SHORT if ELEMENT_ARRAY_BUFFER is a Uint16Array.
      tokenMap[token] = new ElementBlob(elements, indices, positions, mode, context.UNSIGNED_SHORT);
      return token;
    },
    setUp(token: string, program: ShaderProgram, attribMap?: {[name:string]:string}): void {
      let blob = tokenMap[token];
      if (isDefined(blob)) {
        if (isDefined(program)) {
          let indices = blob.indices;
          indices.bind(context.ELEMENT_ARRAY_BUFFER);

          let positions = blob.positions;
          positions.bind(context.ARRAY_BUFFER);
          // TODO: This hard coded name should vanish.
          let aName: string = attribName(Symbolic.ATTRIBUTE_POSITION, attribMap);
          let posLocation = program.attributes[aName];
          if (isDefined(posLocation)) {
            posLocation.vertexPointer(3);
          }
          else {
            throw new Error(aName + " is not a valid program attribute");
          }
          context.bindBuffer(context.ARRAY_BUFFER, null);
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
        let elements = blob.elements;
        context.drawElements(blob.drawMode, elements.indices.length, blob.drawType, 0);
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
    checkOut(token: string): Elements {
      let blob = tokenMap[token];
      if (isDefined(blob)) {
        let indices = blob.indices;
        self.removeContextUser(indices);
        // Do the same for the attributes.
        delete tokenMap[token];
        return blob.elements;
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
