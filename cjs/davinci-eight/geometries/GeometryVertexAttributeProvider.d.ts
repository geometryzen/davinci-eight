import Geometry = require('../geometries/Geometry');
/**
 * This class acts as an adapter from a Geometry to a VertexAttributeProvider.
 */
declare class GeometryVertexAttributeProvider<G extends Geometry> implements VertexAttributeProvider {
    geometry: G;
    private aVertexPositionArray;
    private aVertexColorArray;
    private aVertexNormalArray;
    constructor(geometry: G);
    draw(context: WebGLRenderingContext): void;
    dynamic(): boolean;
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttributeData(name: string): Float32Array;
    getAttributeMetaInfos(): AttributeMetaInfos;
    update(time: number, attributes: {
        modifiers: string[];
        type: string;
        name: string;
    }[]): void;
}
export = GeometryVertexAttributeProvider;
