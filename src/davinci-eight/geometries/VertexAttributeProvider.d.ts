/// <reference path='./AttributeMetaInfos.d.ts'/>
/**
 * @class VertexAttributeProvider
 */
interface VertexAttributeProvider {
  draw(context: WebGLRenderingContext): void;
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
  /**
   * Provides the values required for vertex shader attributes. 
   * @method getAttributeData
   * @return {Float32Array} The array of attribute values.
   */
  getVertexAttributeData(name: string): Float32Array;
  /**
   * Provides the meta information corresponsing to provided attribute values. 
   * @method getAttributeMetaInfos
   * @return {AttributeMetaInfos} The meta information corresponding to all attributes supported.
   */
  getAttributeMetaInfos(): AttributeMetaInfos;
  /**
   * Determines how WebGL buffers associated with attribute variables should be allocated. 
   * @method dynamics
   * @return {Number} 0 <=> STATIC_DRAW, 1 <=> DYNAMIC_DRAW, 2 <=> STREAM_DRAW.
   */
  dynamics(): boolean;
  /**
   * Determines whether this attribute provider uses vetex indexing.
   * @method hasElements
   * @return {Boolean} true if the provider uses vertex indexing.
   */
  hasElements(): boolean;
  /**
   * @method getElements
   * @return {Unit16Array} The array of vertex indices.
   */
  getElements(): Uint16Array;
  /**
   * Determines how element buffers are allocated according to their usage.
   * 0 <=> STATIC_DRAW, 1 <=> DYNAMIC_DRAW, 2 <=> STREAM_DRAW.
   */
  //getElementDynamics(): number;
}