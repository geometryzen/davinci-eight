/// <reference path="../geometries/VertexAttributeProvider.d.ts" />

class RGBGeometry implements VertexAttributeProvider {
  private elements: Uint16Array;
  private vertices: Float32Array;
  private vertexColors: Float32Array;
  constructor() {
    
  }
  draw(context: WebGLRenderingContext) {
    context.drawElements(context.POINTS, this.elements.length, context.UNSIGNED_SHORT, 0);
  }
  dynamics(): boolean {
    return false;
  }
  getAttributeMetaInfos(): AttributeMetaInfos {
    return {
      position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
      color:    { name: 'aVertexColor',    type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
    };
  }
  hasElements() {
    return true;
  }
  getElements() {
    return this.elements;
  }
  getVertexAttributeData(name: string) {
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
  update(time: number, attributes: {name: string}[]): void {
    var vs: number[] = [
      0,0,1,
      0,0,0,
      1,0,1,
      1,0,0,
      0,1,1,
      0,1,0,
      1,1,1,
      1,1,0
    ].map(function(coord: number) {return coord - 0.5;});
    var cs: number[] = [
      0,0,0,  // black
      0,0,1,  // blue,
      0,1,0,  // green
      0,1,1,  // cyan
      1,0,0,  // red
      1,0,1,  // magenta
      1,1,0,  // yellow
      1,1,1   // white
    ];
    //var ls: number[] = [0,1,0,2,0,4,1,3,1,5,2,3,2,6,3,7,4,6,5,7,4,5,6,7];
    //this.lines = new Uint16Array(ls);
    var ps: number[] = [0,1,2,3,4,5,6,7];
    this.elements = new Uint16Array(ps);
    this.vertices = new Float32Array(vs);
    this.vertexColors = new Float32Array(cs);
  }
}
export = RGBGeometry;
