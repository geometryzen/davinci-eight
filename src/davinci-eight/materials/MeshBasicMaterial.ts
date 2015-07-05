/// <reference path='../materials/Material'/>
/// <reference path='../materials/UniformMetaInfo'/>
import Camera = require('../cameras/Camera');
import Mesh = require('../objects/Mesh');
import smartMaterial = require('../materials/smartMaterial');

// Can we defer the creation of smartMaterial until the geometry is known?
// Maybe the mesh tells the material ablout the geometry?
let attributes: AttributeMetaInfos = {
  position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
  color:    { name: 'aVertexColor',    type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
  normal:   { name: 'aVertexNormal',   type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
};

class MeshBasicMaterial implements Material {
  private material: Material;
  constructor() {
    var uniforms: UniformMetaInfo = Camera.getUniformMetaInfo();
    var descriptors = Mesh.getUniformMetaInfo();
    for (var name in descriptors) {
      uniforms[name] = descriptors[name];
    }
    this.material = smartMaterial(attributes, uniforms);
  }
  contextFree(context: WebGLRenderingContext) {
    return this.material.contextFree(context);
  }
  contextGain(context: WebGLRenderingContext, contextGainId: string) {
    return this.material.contextGain(context, contextGainId);
  }
  contextLoss() {
    return this.material.contextLoss();
  }
  hasContext() {
    return this.material.hasContext();
  }
  get attributes() {
    return this.material.attributes;
  }
  get uniforms() {
    return this.material.uniforms;
  }
  get varyings() {
    return this.material.varyings;
  }
  get program(): WebGLProgram {
    return this.material.program;
  }
  get programId(): string {
    return this.material.programId;
  }
}

export = MeshBasicMaterial;
