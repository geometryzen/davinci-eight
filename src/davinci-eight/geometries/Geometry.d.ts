interface Geometry {
  draw(context: WebGLRenderingContext): void;
  dynamic(): boolean;
  /**
   * Declares the vertex shader attributes the geometry can supply and information required for binding.
   */
  getAttributes(): {name: string, size: number, normalized: boolean, stride: number, offset: number}[];
  getElements(): Uint16Array;
  getVertexAttribArrayData(name: string): Float32Array;
  update(time: number, names: string[]): void;
}