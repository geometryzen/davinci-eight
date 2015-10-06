import ColorFacet = require('../../uniforms/ColorFacet')
import ModelFacet = require('../../models/ModelFacet')
import CuboidGeometry = require('../../geometries/CuboidGeometry')
import Drawable = require('../../scene/Drawable')
import SmartMaterialBuilder = require('../../materials/SmartMaterialBuilder')
import ISlide = require('../../slideshow/ISlide')
import ISlideHost = require('../../slideshow/ISlideHost')
import ISlideTask = require('../../slideshow/ISlideTask')
import Shareable = require('../../utils/Shareable')
import Symbolic = require('../../core/Symbolic')

class CubeTask extends Shareable implements ISlideTask {
  private name: string
  private sceneNames: string[]
  constructor(name: string, sceneNames: string[]) {
    super('CubeTx')
    this.name = name;
    this.sceneNames = sceneNames.map(function(sceneName){return sceneName})
  }
  destructor(): void {
    
  }
  exec(slide: ISlide, host: ISlideHost): void {
    var geometry = new CuboidGeometry()
    geometry.k = 1
    geometry.calculate()
    var elements = geometry.toElements()
    var smb = new SmartMaterialBuilder(elements)
    smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3')
    smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4')
    smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4')
    smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4')
    var material = smb.build([])
    try {
      var thing = new Drawable(elements, material)
      try {
        thing.setFacet('model', new ModelFacet()).release()
        thing.setFacet('color', new ColorFacet().setRGB(0, 1, 0)).release()
        thing.name = this.name

        host.addDrawable(this.name, thing)

        this.sceneNames.forEach(function(sceneName) {
          host.addToScene(thing.name, sceneName)
        })
      }
      finally {
          thing.release()
      }
    }
    finally {
      material.release()
    }
  }
  undo(slide: ISlide, host: ISlideHost): void {
    var drawableName = this.name
    this.sceneNames.forEach(function(sceneName) {
      host.removeFromScene(drawableName, sceneName)
    })
    host.removeDrawable(drawableName)
  }
}

export = CubeTask
