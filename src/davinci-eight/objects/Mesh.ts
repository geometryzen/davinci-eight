/// <reference path='../geometries/VertexAttributeProvider.d.ts'/>
/// <reference path='../materials/Material.d.ts'/>
/// <reference path='../materials/UniformMetaInfo.d.ts'/>
/// <reference path='../renderers/VertexUniformProvider.d.ts'/>
/// <reference path="../geometries/AttributeMetaInfos.d.ts" />
import Camera = require('../cameras/Camera');
import mesh = require('./mesh');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
import FactoredDrawable = require('../objects/FactoredDrawable');
import Geometry = require('../geometries/Geometry');
import GeometryVertexAttributeProvider = require('../geometries/GeometryVertexAttributeProvider');

declare var Euclidean3: any;

function modelViewMatrix(position, attitude): Matrix4 {
  var matrix = new Matrix4();
  matrix.identity();
  matrix.translate(position);
  var rotation =new Matrix4();
  rotation.rotate(attitude);
  matrix.mul(rotation);
  return matrix;
}

class MeshVertexUniformProvider implements VertexUniformProvider {
  public position: {x: number; y: number; z: number};
  public attitude: {yz: number; zx: number; xy: number; w: number};
  constructor() {
  }
  getUniformMatrix3(name: string) {
    switch(name) {
      case 'uN': {
        // It's unfortunate that we have to recompute the model-view matrix.
        // We could cache it, being careful that we don't assume the callback order.
        // We don't want to compute it in the shader beacause that would be per-vertex.
        var normalMatrix = new Matrix3();
        var mv = modelViewMatrix(this.position, this.attitude);
        normalMatrix.normalFromMatrix4(mv);
        return {transpose: false, matrix3: new Float32Array(normalMatrix.elements)};
      }
      break;
      default: {
        return null;
      }
    }
  }
  getUniformMatrix4(name: string) {
    switch(name) {
      case 'uMV': {
        var elements = modelViewMatrix(this.position, this.attitude).elements;
        return {transpose: false, matrix4: new Float32Array(elements)};
      }
      break;
      default: {
        return null;
      }
    }
  }
}

class Mesh<G extends Geometry, M extends Material> implements FactoredDrawable<G, M> {
  public geometry: G;
  private innerMesh: FactoredDrawable<GeometryVertexAttributeProvider<G>, M>;
  private meshVertexUniformProvider: MeshVertexUniformProvider = new MeshVertexUniformProvider();
  constructor(geometry: G, material: M) {
    this.geometry = geometry;
    let mvap: GeometryVertexAttributeProvider<G> = new GeometryVertexAttributeProvider(geometry);
    this.innerMesh = mesh(mvap, material, this.meshVertexUniformProvider);
  }
  get material() {
    return this.innerMesh.material;
  }
  get attitude(): Spinor3 {
    return this.innerMesh.attitude;
  }
  set attitude(spinor: Spinor3) {
    this.innerMesh.attitude = spinor;
  }
  get position(): Vector3 {
    return this.innerMesh.position;
  }
  set position(position: Vector3) {
    this.innerMesh.position = position;
  }
  get drawGroupName() {
    return this.innerMesh.drawGroupName;
  }
  useProgram(context: WebGLRenderingContext) {
    this.innerMesh.useProgram(context);
  }
  draw(context: WebGLRenderingContext, time: number, uniformProvider: VertexUniformProvider) {
    this.meshVertexUniformProvider.position = this.innerMesh.position;
    this.meshVertexUniformProvider.attitude = this.innerMesh.attitude;
    return this.innerMesh.draw(context, time, uniformProvider);
  }
  contextFree(context: WebGLRenderingContext) {
    return this.innerMesh.contextFree(context);
  }
  contextGain(context: WebGLRenderingContext, contextGainId: string) {
    return this.innerMesh.contextGain(context, contextGainId);
  }
  contextLoss() {
    return this.innerMesh.contextLoss();
  }
  hasContext() {
    return this.innerMesh.hasContext();
  }
  static getUniformMetaInfo(): UniformMetaInfo {
    var uniforms: UniformMetaInfo = {};
    uniforms['modelViewMatrix']  = {name: 'uMV', type: 'mat4'};
    uniforms['normalMatrix']     = {name: 'uN',  type: 'mat3'};
    return uniforms;
  }
}

export = Mesh;
