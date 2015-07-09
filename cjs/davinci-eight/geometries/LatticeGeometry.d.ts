/// <reference path="../../../src/davinci-eight/geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
declare class LatticeGeometry implements VertexAttributeProvider {
    private elements;
    private vertices;
    private vertexColors;
    private vertexNormals;
    private I;
    private J;
    private K;
    private generator;
    constructor(I: number, J: number, K: number, generator: (i: number, j: number, k: number, time: number) => {
        x: number;
        y: number;
        z: number;
    });
    draw(context: WebGLRenderingContext): void;
    dynamics(): boolean;
    getAttributeMetaInfos(): AttributeMetaInfos;
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttributeData(name: string): Float32Array;
    update(time: number): void;
}
export = LatticeGeometry;
