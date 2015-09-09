import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import Geometry3 = require('../geometries/Geometry3');
import DefaultAttribProvider = require('../core/DefaultAttribProvider');
import DrawMode = require('../core/DrawMode');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
/**
 * Adapter from a Geometry to a AttribProvider.
 * Enables the rapid construction of meshes starting from classes that extend Geometry.
 * Automatically uses elements (vertex indices).
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
declare class GeometryAdapter extends DefaultAttribProvider {
    geometry: Geometry3;
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
    /**
     * @class GeometryAdapter
     * @constructor
     * @param monitor {RenderingContextMonitor}
     * @param geometry {Geometry3} The geometry that must be adapted to a AttribProvider.
     */
    constructor(monitor: RenderingContextMonitor, geometry: Geometry3, options?: {
        drawMode?: DrawMode;
        elementsUsage?: number;
        positionVarName?: string;
        normalVarName?: string;
    });
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    drawMode: DrawMode;
    draw(): void;
    dynamic: boolean;
    getAttribData(): AttribDataInfos;
    getAttribMeta(): AttribMetaInfos;
    update(): void;
    private computeLines();
    private computePoints();
}
export = GeometryAdapter;
