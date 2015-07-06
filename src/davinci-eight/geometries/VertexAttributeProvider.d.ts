/// <reference path='./AttributeMetaInfos.d.ts'/>
interface VertexAttributeProvider {
  draw(context: WebGLRenderingContext): void;
  dynamic(): boolean;
  hasElements(): boolean;
  getElements(): Uint16Array;
  getVertexAttributeData(name: string): Float32Array;
  getAttributeMetaInfos(): AttributeMetaInfos;
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
}