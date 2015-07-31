import AttributeProvider = require('../core/AttributeProvider');
import SphereOptions = require('../mesh/SphereOptions');
declare class SphereBuilder {
    private $radius;
    private $phiStart;
    private $phiLength;
    private $thetaStart;
    private $thetaLength;
    private $widthSegments;
    private $heightSegments;
    private $wireFrame;
    constructor(options?: SphereOptions);
    radius: number;
    phiStart: number;
    phiLength: number;
    thetaStart: number;
    thetaLength: number;
    widthSegments: number;
    heightSegments: number;
    wireFrame: boolean;
    setRadius(radius: number): SphereBuilder;
    setPhiStart(phiStart: number): SphereBuilder;
    setPhiLength(phiLength: number): SphereBuilder;
    setThetaStart(thetaStart: number): SphereBuilder;
    setThetaLength(thetaLength: number): SphereBuilder;
    setWidthSegments(widthSegments: number): SphereBuilder;
    setHeightSegments(heightSegments: number): SphereBuilder;
    setWireFrame(wireFrame: boolean): SphereBuilder;
    buildMesh(): AttributeProvider;
}
export = SphereBuilder;