/// <reference path='./AttributeMetaInfos.d.ts'/>
/**
 * @class VertexAttributeProvider
 */
interface VertexAttributeProvider {
  draw(context: WebGLRenderingContext): void;
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;

  getVertexAttributeData(name: string): Float32Array;
  getAttributeMetaInfos(): AttributeMetaInfos;
  /**
   * Determines 
   */
  dynamics(): boolean;

  hasElements(): boolean;
  getElements(): Uint16Array;
  /**
   * Determines how element buffers are allocated according to their usage.
   * 0 <=> STATIC_DRAW, 1 <=> DYNAMIC_DRAW, 2 <=> STREAM_DRAW.
   */
  //getElementDynamics(): number;
}