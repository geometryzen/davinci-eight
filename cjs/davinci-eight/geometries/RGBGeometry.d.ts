/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
declare class RGBGeometry implements VertexAttributeProvider {
    private elements;
    private vertices;
    private vertexColors;
    constructor();
    draw(context: WebGLRenderingContext): void;
    dynamic(): boolean;
    getAttributeMetaInfos(): AttributeMetaInfos;
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttributeData(name: string): Float32Array;
    update(time: number, attributes: {
        name: string;
    }[]): void;
}
export = RGBGeometry;
