import MutableNumber = require('../math/MutableNumber');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IFacetVisitor = require('../core/IFacetVisitor');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');

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
  uniformVectorE2(name: string, vector: VectorE2): void {
    console.warn("uniformVectorE2");
  }
  uniformVectorE3(name: string, vector: VectorE3): void {
    console.warn("uniformVectorE3");
  }
  uniformVectorE4(name: string, vector: VectorE4): void {
    console.warn("uniformVectorE4");
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