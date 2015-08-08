import AttribProvider = require('../core/AttribProvider');
import CylinderArgs = require('../mesh/CylinderArgs');
import CylinderOptions = require('../mesh/CylinderOptions');
import cylinderMesh = require('../mesh/cylinderMesh');

class CylinderMeshBuilder {
  private args: CylinderArgs;
  constructor(options?: CylinderOptions) {
    this.args = new CylinderArgs(options);
  }
  setHeight(height: number): CylinderMeshBuilder {
    this.args.setHeight(height);
    return this;
  }
  setRadiusTop(radiusTop: number): CylinderMeshBuilder {
    this.args.setRadiusTop(radiusTop);
    return this;
  }
  setRadiusBottom(radiusBottom: number): CylinderMeshBuilder {
    this.args.setRadiusBottom(radiusBottom);
    return this;
  }
  buildMesh(): AttribProvider {
    return cylinderMesh(this);
  }
}

export = CylinderMeshBuilder;
