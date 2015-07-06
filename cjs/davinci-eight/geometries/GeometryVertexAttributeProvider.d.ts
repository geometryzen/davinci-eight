import Geometry = require('../geometries/Geometry');
declare class GeometryVertexAttributeProvider<G extends Geometry> implements VertexAttributeProvider {
    geometry: G;
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
