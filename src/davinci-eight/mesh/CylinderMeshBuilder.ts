import AttribProvider = require('../core/AttribProvider');
import CylinderArgs = require('../mesh/CylinderArgs');
import CylinderOptions = require('../mesh/CylinderOptions');
import cylinderMesh = require('../mesh/cylinderMesh');

class CylinderMeshBuilder {
  private args: CylinderArgs;
  constructor(options?: CylinderOptions) {
    this.args = new CylinderArgs(options);
  }
  setRadiusTop(radiusTop: number): CylinderMeshBuilder {
    this.args.setRadiusTop(radiusTop);
    return this;
  }
  setRadiusBottom(radiusBottom: number): CylinderMeshBuilder {
    this.args.setRadiusBottom(radiusBottom);
    return this;
  }
  setHeight(height: number): CylinderMeshBuilder {
    this.args.setHeight(height);
    return this;
  }
  setRadialSegments(radialSegments: number): CylinderMeshBuilder {
    this.args.setRadialSegments(radialSegments);
    return this;
  }
  setHeightSegments(heightSegments: number): CylinderMeshBuilder {
    this.args.setHeightSegments(heightSegments);
    return this;
  }
  setOpenEnded(openEnded: boolean): CylinderMeshBuilder {
    this.args.setOpenEnded(openEnded);
    return this;
  }
  setWireFrame(wireFrame: boolean): CylinderMeshBuilder {
    this.args.setWireFrame(wireFrame);
    return this;
  }
  buildMesh(): AttribProvider {
    return cylinderMesh(this);
  }
}

export = CylinderMeshBuilder;
