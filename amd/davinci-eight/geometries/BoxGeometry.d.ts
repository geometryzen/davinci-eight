/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
declare class BoxGeometry implements VertexAttributeProvider {
    private cuboid;
    constructor(width: number, height: number, depth: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
    draw(context: WebGLRenderingContext): void;
    dynamics(): boolean;
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
export = BoxGeometry;
