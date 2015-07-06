/// <reference path="../../../src/davinci-eight/geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
declare class CurveGeometry implements VertexAttributeProvider {
    private elements;
    private vertices;
    private vertexColors;
    private n;
    private generator;
    constructor(n: number, generator: (i: number, time: number) => {
        x: number;
        y: number;
        z: number;
    });
    draw(context: WebGLRenderingContext): void;
    dynamic(): boolean;
    getAttributeMetaInfos(): AttributeMetaInfos;
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttributeData(name: string): Float32Array;
    update(time: number): void;
}
export = CurveGeometry;
