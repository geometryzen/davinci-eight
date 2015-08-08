import AttribProvider = require('../core/AttribProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
declare class CylinderMeshBuilder {
    private args;
    constructor(options?: CylinderOptions);
    setHeight(height: number): CylinderMeshBuilder;
    setRadiusTop(radiusTop: number): CylinderMeshBuilder;
    setRadiusBottom(radiusBottom: number): CylinderMeshBuilder;
    buildMesh(): AttribProvider;
}
export = CylinderMeshBuilder;
