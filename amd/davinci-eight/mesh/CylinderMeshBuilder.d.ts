import AttribProvider = require('../core/AttribProvider');
import CylinderArgs = require('../mesh/CylinderArgs');
import CylinderOptions = require('../mesh/CylinderOptions');
import ContextManager = require('../core/ContextManager');
declare class CylinderMeshBuilder extends CylinderArgs {
    constructor(options?: CylinderOptions);
    setRadiusTop(radiusTop: number): CylinderMeshBuilder;
    setRadiusBottom(radiusBottom: number): CylinderMeshBuilder;
    setHeight(height: number): CylinderMeshBuilder;
    setRadialSegments(radialSegments: number): CylinderMeshBuilder;
    setHeightSegments(heightSegments: number): CylinderMeshBuilder;
    setOpenEnded(openEnded: boolean): CylinderMeshBuilder;
    setThetaStart(thetaStart: number): CylinderMeshBuilder;
    setThetaLength(thetaLength: number): CylinderMeshBuilder;
    setWireFrame(wireFrame: boolean): CylinderMeshBuilder;
    buildMesh(monitor: ContextManager): AttribProvider;
}
export = CylinderMeshBuilder;
