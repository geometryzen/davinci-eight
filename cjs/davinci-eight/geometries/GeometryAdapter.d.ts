import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import Geometry = require('../geometries/Geometry');
import DefaultAttribProvider = require('../core/DefaultAttribProvider');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
/**
 * Adapter from a Geometry to a AttribProvider.
 * Enables the rapid construction of meshes starting from classes that extend Geometry.
 * Automatically uses elements (vertex indices).
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
declare class GeometryAdapter extends DefaultAttribProvider {
    geometry: Geometry;
    private elementArray;
    private aVertexPositionArray;
    private aVertexNormalArray;
    private $drawMode;
    private elementsUsage;
    grayScale: boolean;
    private lines;
    private points;
    private positionVarName;
    private normalVarName;
    private indexBuffer;
    private positionBuffer;
    private normalBuffer;
    private attributeDataInfos;
    private _refCount;
    /**
     * @class GeometryAdapter
     * @constructor
     * @param geometry {Geometry} The geometry that must be adapted to a AttribProvider.
     */
    constructor(geometry: Geometry, options?: {
        drawMode?: DrawMode;
        elementsUsage?: DataUsage;
        positionVarName?: string;
        normalVarName?: string;
    });
    addRef(): void;
    release(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    hasContext(): boolean;
    drawMode: DrawMode;
    draw(): void;
    dynamic: boolean;
    hasElementArray(): boolean;
    getElementArray(): {
        usage: DataUsage;
        data: Uint16Array;
    };
    getAttribArray(name: string): {
        usage: DataUsage;
        data: Float32Array;
    };
    getAttribData(): AttribDataInfos;
    getAttribMeta(): AttribMetaInfos;
    update(): void;
    private computeLines();
    private computePoints();
}
export = GeometryAdapter;
