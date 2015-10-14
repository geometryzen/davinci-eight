import ColorFacet = require('../uniforms/ColorFacet')
import CuboidGeometry = require('../geometries/CuboidGeometry')
import Drawable = require('../scene/Drawable')
import ISlideCommand = require('../slideshow/ISlideCommand')
import ISlideHost = require('../slideshow/ISlideHost')
import MeshMaterial = require('../materials/MeshMaterial')
import ModelFacet = require('../models/ModelFacet')
import Shareable = require('../utils/Shareable')

class CuboidGeometryCommand extends Shareable implements ISlideCommand {
  private name: string;
  constructor(name: string) {
    super('CuboidCommand')
    this.name = name
  }
  protected destructor(): void {
    super.destructor();
  }
  redo(host: ISlideHost) {
    var geometry = new CuboidGeometry()
    host.addGeometry(this.name, geometry)
  }
  undo(host: ISlideHost) {
    host.removeGeometry(this.name)
  }
}

export = CuboidGeometryCommand