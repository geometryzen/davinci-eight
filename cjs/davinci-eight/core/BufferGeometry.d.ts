import BufferAttribute = require('../core/BufferAttribute');
import Geometry = require('../geometries/Geometry');
declare class BufferGeometry extends Geometry {
    private attributes;
    attributesKeys: string[];
    uuid: string;
    drawcalls: {
        start: number;
        count: number;
        index: number;
    }[];
    boundingBox: any;
    boundingSphere: any;
    constructor();
    addAttribute(name: string, attribute: BufferAttribute): void;
    getAttribute(name: string): BufferAttribute;
    addDrawCall(start: number, count: number, indexOffset?: number): void;
    fromGeometry(geometry: Geometry, settings: any): BufferGeometry;
}
export = BufferGeometry;
