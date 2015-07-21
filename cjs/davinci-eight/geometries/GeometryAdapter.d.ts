import AttributeMetaInfos = require('../core/AttributeMetaInfos');
import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import DrawMode = require('../core/DrawMode');
/**
 * Adapter from a Geometry to a AttributeProvider.
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
declare class GeometryAdapter implements AttributeProvider {
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
     * @param geometry {Geometry} The geometry that must be adapted to a AttributeProvider.
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
