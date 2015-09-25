import AttribLocation = require('../core/AttribLocation')
import IContextConsumer = require('../core/IContextConsumer')
import IContextProvider = require('../core/IContextProvider')
import makeWebGLProgram = require('../programs/makeWebGLProgram')
import UniformLocation = require('../core/UniformLocation')
import Shareable = require('../utils/Shareable')

/**
 * This class is "simple because" it assumes exactly one vertex shader and on fragment shader.
 * This class assumes that it will only be supporting a single WebGL rendering context.
 * The existence of the manager in the constructor enables it to enforce this invariant.
 */
class SimpleWebGLProgram extends Shareable implements IContextConsumer {
  // Keep private to avoid worrying about reference counting.  
  private manager: IContextProvider;
  private vertexShader: string;
  private fragmentShader: string;
  private attribs: string[];
  private program: WebGLProgram;
  public attributes: { [name: string]: AttribLocation } = {};
  public uniforms: { [name: string]: UniformLocation } = {};
  constructor(manager: IContextProvider, vertexShader: string, fragmentShader: string, attribs: string[]) {
    super('SimpleWebGLProgram')
    this.manager = manager
    // Interesting. CM can't be addRefd!
    // manager.addRef()
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.attribs = attribs
    this.manager.addContextListener(this)
    this.manager.synchronize(this)
  }
  protected destructor(): void {
    let manager = this.manager
    let canvasId = manager.canvasId
    // If the program has been allocated, find out what to do with it.
    // (we may have been disconnected from listening)
    if (this.program) {
      let gl = manager.gl
      if (gl) {
       if (gl.isContextLost()) {
          this.contextLost(canvasId)
        }
        else {
          this.contextFree(canvasId)
        }
      }
      else {
        console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.")
      }
    }
    manager.removeContextListener(this)
    // this.manager.release()
    this.manager = void 0
  }
  contextGain(manager: IContextProvider): void {
    if (!this.program) {
      this.program = makeWebGLProgram(manager.gl, this.vertexShader, this.fragmentShader, this.attribs)
      let context = manager.gl
      let program = this.program
      let attributes = this.attributes
      let uniforms = this.uniforms
      let activeAttributes: number = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES)
      for (var a = 0; a < activeAttributes; a++) {
        let activeAttribInfo: WebGLActiveInfo = context.getActiveAttrib(program, a)
        let name: string = activeAttribInfo.name
        if (!attributes[name]) {
          attributes[name] = new AttribLocation(manager, name)
        }
      }
      let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS)
      for (var u = 0; u < activeUniforms; u++) {
        let activeUniformInfo: WebGLActiveInfo = context.getActiveUniform(program, u)
        let name: string = activeUniformInfo.name
        if (!uniforms[name]) {
          uniforms[name] = new UniformLocation(manager, name)
        }
      }
      for(var aName in attributes) {
        attributes[aName].contextGain(context, program)
      }
      for(var uName in uniforms) {
        uniforms[uName].contextGain(context, program)
      }
    }
  }
  contextLost(canvasId: number): void {
    this.program = void 0
    for (var aName in this.attributes) {
      this.attributes[aName].contextLost()
    }
    for (var uName in this.uniforms) {
      this.uniforms[uName].contextLost()
    }
  }
  contextFree(canvasId: number): void {
    if (this.program) {
      let gl = this.manager.gl
      if (gl) {
        if (!gl.isContextLost()) {
          gl.deleteProgram(this.program)
        }
        else {
          // WebGL has lost the context, effectively cleaning up everything.
        }
      }
      else {
        console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.")
      }
      this.program = void 0
    }
    for(var aName in this.attributes) {
      this.attributes[aName].contextFree()
    }
    for(var uName in this.uniforms) {
      this.uniforms[uName].contextFree()
    }
  }
  use(): void {
    this.manager.gl.useProgram(this.program)
  }
}

export = SimpleWebGLProgram
