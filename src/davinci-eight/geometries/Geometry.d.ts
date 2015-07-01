interface Geometry {
  draw(context: WebGLRenderingContext): void;
  dynamic(): boolean;
  getAttributes(): {name: string, size: number, normalized: boolean, stride: number, offset: number}[];
  hasElements(): boolean;
  getElements(): Uint16Array;
  getVertexAttribArrayData(name: string): Float32Array;
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
}