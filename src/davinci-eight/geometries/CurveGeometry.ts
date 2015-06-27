/// <reference path="../geometries/Geometry.d.ts" />

function makeArray(length: number) {
  var xs: number[] = [];
  for (var i = 0; i < length; i++) {
    xs.push(1.0);
    xs.push(1.0);
    xs.push(1.0);
  }
  return xs;
}

class CurveGeometry implements Geometry {
  private elements: Uint16Array;
  private vertices: Float32Array;
  private vertexColors: Float32Array;
  private n: number;
  private generator: (i: number, time: number) => {x:number; y:number; z:number}
  constructor(n: number, generator: (i: number, time: number) => {x: number; y: number; z: number}) {
    this.n = n;
    this.generator = generator;
  }
  draw(context: WebGLRenderingContext) {
    context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
  }
  dynamic(): boolean {
    return true;
  }
  getAttributes() {
    return [
      {name: 'aVertexPosition', size: 3},
      {name: 'aVertexColor', size: 3}
    ];
  }
  getElements(): Uint16Array {
    return this.elements;
  }
  getVertexAttribArrayData(name: string) {
    switch(name) {
      case 'aVertexPosition': {
        return this.vertices;
      }
      case 'aVertexColor': {
        return this.vertexColors;
      }
      default: {
        return;
      }
    }
  }
  update(time: number): void {
    var n = this.n;
    var generator = this.generator;
    var vs: number[] = [];
    var indices: number[] = [];
    for (var i = 0; i < n; i++) {
      var pos = generator(i, time);
      vs.push(pos.x);
      vs.push(pos.y);
      vs.push(pos.z);
      indices.push(i);
    }
    this.elements = new Uint16Array(indices);
    this.vertices = new Float32Array(vs);
    this.vertexColors = new Float32Array(makeArray(indices.length));
  }
}
export = CurveGeometry;