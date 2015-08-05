import AttribProvider = require('../core/AttribProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class CylinderBuilder
 */
declare class CylinderBuilder {
    private $radiusTop;
    private $radiusBottom;
    private $height;
    private $axis;
    private $depth;
    private $widthSegments;
    private $heightSegments;
    private $depthSegments;
    private $wireFrame;
    constructor(options?: CylinderOptions);
    radiusTop: number;
    radiusBottom: number;
    height: number;
    axis: Cartesian3;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    wireFrame: boolean;
    setRadiusTop(radiusTop: number): CylinderBuilder;
    setRadiusBottom(radiusBottom: number): CylinderBuilder;
    setHeight(height: number): CylinderBuilder;
    setAxis(axis: Cartesian3): CylinderBuilder;
    setDepth(depth: number): CylinderBuilder;
    setWidthSegments(widthSegments: number): CylinderBuilder;
    setHeightSegments(heightSegments: number): CylinderBuilder;
    setDepthSegments(depthSegments: number): CylinderBuilder;
    setWireFrame(wireFrame: boolean): CylinderBuilder;
    buildMesh(): AttribProvider;
}
export = CylinderBuilder;
