interface Geometry {
  draw(context: WebGLRenderingContext): void;
  dynamic(): boolean;
  hasElements(): boolean;
  getElements(): Uint16Array;
  getVertexAttributeData(name: string): Float32Array;
  getVertexAttributeMetaInfos(): {property: string, name: string, size: number, normalized: boolean, stride: number, offset: number}[];
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
}