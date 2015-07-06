declare class BoxGeometry implements Geometry {
    private cuboid;
    constructor(width: number, height: number, depth: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
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
export = BoxGeometry;
