/// <amd-dependency path="davinci-blade/Euclidean3" name="Euclidean3"/>
/// <reference path='./FactoredDrawable.d.ts'/>
/// <reference path='../geometries/Geometry.d.ts'/>
/// <reference path='../materials/Material.d.ts'/>
/// <reference path='../materials/UniformMetaInfo.d.ts'/>
/// <reference path='../renderers/UniformProvider.d.ts'/>
/// <reference path="../geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../geometries/CuboidGeometry.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');
import Camera = require('../cameras/Camera');
import mesh = require('./mesh');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Quaternion = require('../math/Quaternion');

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

class MeshUniformProvider implements UniformProvider {
  public position: {x:number;y:number;z:number};
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
  private innerMesh: FactoredDrawable<G, M>;
  private meshUniformProvider: MeshUniformProvider = new MeshUniformProvider();
  constructor(geometry: G, material: M) {
    this.innerMesh = mesh(geometry, material, this.meshUniformProvider);
  }
  get geometry() {
    return this.innerMesh.geometry;
  }
  get material() {
    return this.innerMesh.material;
  }
  get attitude() {
    return this.innerMesh.attitude;
  }
  set attitude(value: blade.Euclidean3) {
    this.innerMesh.attitude = value;
  }
  get position() {
    return this.innerMesh.position;
  }
  set position(value: blade.Euclidean3) {
    this.innerMesh.position = value;
  }
  setRotationFromQuaternion(q: Quaternion): void {
    this.innerMesh.attitude.yz = q.x;
    this.innerMesh.attitude.zx = q.y;
    this.innerMesh.attitude.xy = q.z;
    this.innerMesh.attitude.w = q.w;
  }
  get drawGroupName() {
    return this.innerMesh.drawGroupName;
  }
  useProgram(context: WebGLRenderingContext) {
    this.innerMesh.useProgram(context);
  }
  draw(context: WebGLRenderingContext, time: number, uniformProvider: UniformProvider) {
    this.meshUniformProvider.position = this.innerMesh.position;
    this.meshUniformProvider.attitude = this.innerMesh.attitude;
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
