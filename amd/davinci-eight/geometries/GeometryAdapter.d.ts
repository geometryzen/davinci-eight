import AttributeMetaInfos = require('../core/AttributeMetaInfos');
import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import VertexAttributeProvider = require('../core/VertexAttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import DrawMode = require('../core/DrawMode');
/**
 * Adapter from a Geometry to a VertexAttributeProvider.
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
declare class GeometryAdapter implements VertexAttributeProvider {
    geometry: Geometry;
    color: Color;
    colorFunction: (vertexIndex: number, face: Face3, vertexList: Vector3[], normal: Vector3) => Color;
    private elementArray;
    private aVertexPositionArray;
    private aVertexColorArray;
    private aVertexNormalArray;
    private $drawMode;
    grayScale: boolean;
    private lines;
    private points;
    /**
     * @class GeometryAdapter
     * @constructor
     * @param geometry {Geometry} The geometry that must be adapted to a VertexAttributeProvider.
     */
    constructor(geometry: Geometry, options?: {
        drawMode?: DrawMode;
    });
    drawMode: DrawMode;
    draw(context: WebGLRenderingContext): void;
    dynamics(): boolean;
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttributeData(name: string): Float32Array;
    getAttributeMetaInfos(): AttributeMetaInfos;
    update(attributes: ShaderVariableDecl[]): void;
    private computeLines();
    private computePoints();
}
export = GeometryAdapter;
