import CylinderOptions = require('../mesh/CylinderOptions');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class CylinderArgs
 */
declare class CylinderArgs {
    private $radiusTop;
    private $radiusBottom;
    private $height;
    private $radialSegments;
    private $heightSegments;
    private $openEnded;
    private $thetaStart;
    private $thetaLength;
    private $wireFrame;
    private $axis;
    constructor(options?: CylinderOptions);
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    openEnded: boolean;
    thetaStart: number;
    thetaLength: number;
    wireFrame: boolean;
    axis: Cartesian3;
    setRadiusTop(radiusTop: number): CylinderArgs;
    setRadiusBottom(radiusBottom: number): CylinderArgs;
    setHeight(height: number): CylinderArgs;
    setRadialSegments(radialSegments: number): CylinderArgs;
    setHeightSegments(heightSegments: number): CylinderArgs;
    setOpenEnded(openEnded: boolean): CylinderArgs;
    setThetaStart(thetaStart: number): CylinderArgs;
    setThetaLength(thetaLength: number): CylinderArgs;
    setWireFrame(wireFrame: boolean): CylinderArgs;
    setAxis(axis: Cartesian3): CylinderArgs;
}
export = CylinderArgs;
