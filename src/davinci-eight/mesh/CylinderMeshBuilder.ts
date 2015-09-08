import AttribProvider = require('../core/AttribProvider');
import CylinderArgs = require('../mesh/CylinderArgs');
import CylinderOptions = require('../mesh/CylinderOptions');
import cylinderMesh = require('../mesh/cylinderMesh');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');

class CylinderMeshBuilder extends CylinderArgs {
  constructor(options?: CylinderOptions) {
    super(options);
  }
  setRadiusTop(radiusTop: number): CylinderMeshBuilder {
    super.setRadiusTop(radiusTop);
    return this;
  }
  setRadiusBottom(radiusBottom: number): CylinderMeshBuilder {
    super.setRadiusBottom(radiusBottom);
    return this;
  }
  setHeight(height: number): CylinderMeshBuilder {
    super.setHeight(height);
    return this;
  }
  setRadialSegments(radialSegments: number): CylinderMeshBuilder {
    super.setRadialSegments(radialSegments);
    return this;
  }
  setHeightSegments(heightSegments: number): CylinderMeshBuilder {
    super.setHeightSegments(heightSegments);
    return this;
  }
  setOpenEnded(openEnded: boolean): CylinderMeshBuilder {
    super.setOpenEnded(openEnded);
    return this;
  }
  setThetaStart(thetaStart: number): CylinderMeshBuilder {
    super.setThetaStart(thetaStart);
    return this;
  }
  setThetaLength(thetaLength: number): CylinderMeshBuilder {
    super.setThetaLength(thetaLength);
    return this;
  }
  setWireFrame(wireFrame: boolean): CylinderMeshBuilder {
    super.setWireFrame(wireFrame);
    return this;
  }
  buildMesh(monitor: RenderingContextMonitor): AttribProvider {
    return cylinderMesh(monitor, this);
  }
}

export = CylinderMeshBuilder;
