interface Geometry {
  draw(context: WebGLRenderingContext): void;
  dynamic(): boolean;
  getAttributes(): {name: string, size: number}[];
  getElements(): Uint16Array;
  getVertexAttribArrayData(name: string): Float32Array;
  update(time: number, names: string[]): void;
}