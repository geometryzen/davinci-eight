/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
declare class CurveGeometry implements Geometry {
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
    getAttributes(): {
        name: string;
        size: number;
        normalized: boolean;
        stride: number;
        offset: number;
    }[];
    getElements(): Uint16Array;
    getVertexAttribArrayData(name: string): Float32Array;
    update(time: number): void;
}
export = CurveGeometry;
