import ColorFacet = require('../uniforms/ColorFacet')
import CuboidGeometry = require('../geometries/CuboidGeometry')
import Drawable = require('../scene/Drawable')
import ISlideCommand = require('../slideshow/ISlideCommand')
import ISlideHost = require('../slideshow/ISlideHost')
import MeshMaterial = require('../materials/MeshMaterial')
import ModelFacet = require('../models/ModelFacet')
import Shareable = require('../utils/Shareable')

class CubeCommand extends Shareable implements ISlideCommand {
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
    var elements = geometry.toElements()
    var material = new MeshMaterial()
    var cube = new Drawable(elements, material)
    cube.setFacet('model', new ModelFacet()).decRef()
    cube.setFacet('color', new ColorFacet()).decRef().setRGB(1, 1, 1)

    host.addDrawable(this.name, cube)
  }
  undo(host: ISlideHost) {
    host.removeDrawable(this.name)
  }
}

export = CubeCommand