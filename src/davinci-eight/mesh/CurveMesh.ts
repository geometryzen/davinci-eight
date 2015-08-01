import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');

function makeArray(length: number) {
  var xs: number[] = [];
  for (var i = 0; i < length; i++) {
    xs.push(1.0);
    xs.push(1.0);
    xs.push(1.0);
  }
  return xs;
}

class CurveMesh implements AttribProvider {
  private elements: Uint16Array;
  private vertices: Float32Array;
  private vertexColors: Float32Array;
  private n: number;
  private generator: (i: number) => { x: number; y: number; z: number };
  public drawMode: number = 0;
  constructor(n: number, generator: (i: number) => {x: number; y: number; z: number}) {
    this.n = n;
    this.generator = generator;
  }
  draw(context: WebGLRenderingContext) {
    context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
  }
  get dynamic(): boolean {
    return true;
  }
  getAttribMeta(): AttribMetaInfos {
    return {
      position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
      color:    { name: 'aVertexColor',    type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
    };
  }
  hasElementArray(): boolean {
    return true;
  }
  getElementArray(): Uint16Array {
    return this.elements;
  }
  getAttribArray(name: string) {
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
  update(): void {
    var n = this.n;
    var generator = this.generator;
    var vs: number[] = [];
    var indices: number[] = [];
    for (var i = 0; i < n; i++) {
      var pos = generator(i);
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
export = CurveMesh;
