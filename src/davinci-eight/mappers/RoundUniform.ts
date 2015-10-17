import MutableNumber = require('../math/MutableNumber');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IFacetVisitor = require('../core/IFacetVisitor');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

class RoundUniform implements IFacetVisitor {
  private _next: IFacetVisitor;
  constructor() {
  }
  get next() {
    // FIXME: No reference counting yet.
    return this._next;
  }
  set next(next: IFacetVisitor) {
    // FIXME: No reference counting yet.
    this._next = next;
  }
  uniform1f(name: string, x: number, canvasId: number): void {
    if (this._next) {
      this._next.uniform1f(name, Math.round(x), canvasId);
    }
  }
  uniform2f(name: string, x: number, y: number): void {
    console.warn("uniform");
  }
  uniform3f(name: string, x: number, y: number, z: number): void {
    console.warn("uniform");
  }
  uniform4f(name: string, x: number, y: number, z: number, w: number): void {
    console.warn("uniform");
  }
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void {
    console.warn("uniform");
  }
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void {
    console.warn("uniform");
  }
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void {
    console.warn("uniform");
  }
  uniformCartesian2(name: string, vector: Vector2): void {
    console.warn("uniform");
  }
  uniformCartesian3(name: string, vector: Vector3): void {
    console.warn("uniform");
  }
  uniformCartesian4(name: string, vector: Vector4): void {
    console.warn("uniform");
  }
  vector2( name:string, data: number[], canvasId: number): void {
    this._next.vector2(name, data, canvasId)
  }
  vector3( name:string, data: number[], canvasId: number): void {
    this._next.vector3(name, data, canvasId)
  }
  vector4( name:string, data: number[], canvasId: number): void {
    this._next.vector4(name, data, canvasId)
  }
}

export = RoundUniform;