/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
declare class RGBGeometry implements Geometry {
    private elements;
    private vertices;
    private vertexColors;
    constructor();
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
export = RGBGeometry;
