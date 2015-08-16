import AttribProvider = require('../core/AttribProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
declare class CylinderMeshBuilder {
    private args;
    constructor(options?: CylinderOptions);
    setRadiusTop(radiusTop: number): CylinderMeshBuilder;
    setRadiusBottom(radiusBottom: number): CylinderMeshBuilder;
    setHeight(height: number): CylinderMeshBuilder;
    setRadialSegments(radialSegments: number): CylinderMeshBuilder;
    setHeightSegments(heightSegments: number): CylinderMeshBuilder;
    setOpenEnded(openEnded: boolean): CylinderMeshBuilder;
    setWireFrame(wireFrame: boolean): CylinderMeshBuilder;
    buildMesh(): AttribProvider;
}
export = CylinderMeshBuilder;
