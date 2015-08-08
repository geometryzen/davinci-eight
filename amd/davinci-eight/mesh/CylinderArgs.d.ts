import CylinderOptions = require('../mesh/CylinderOptions');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class CylinderArgs
 */
declare class CylinderArgs {
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
    setRadiusTop(radiusTop: number): CylinderArgs;
    setRadiusBottom(radiusBottom: number): CylinderArgs;
    setHeight(height: number): CylinderArgs;
    setAxis(axis: Cartesian3): CylinderArgs;
    setDepth(depth: number): CylinderArgs;
    setWidthSegments(widthSegments: number): CylinderArgs;
    setHeightSegments(heightSegments: number): CylinderArgs;
    setDepthSegments(depthSegments: number): CylinderArgs;
    setWireFrame(wireFrame: boolean): CylinderArgs;
}
export = CylinderArgs;
