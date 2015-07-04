/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
declare class LatticeGeometry implements Geometry {
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
    dynamic(): boolean;
    getVertexAttributeMetaInfos(): {
        property: string;
        name: string;
        size: number;
        normalized: boolean;
        stride: number;
        offset: number;
    }[];
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttributeData(name: string): Float32Array;
    update(time: number): void;
}
export = LatticeGeometry;
