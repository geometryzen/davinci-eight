import Cartesian3 = require('../../math/Cartesian3')

import ColorFacet = require('../../uniforms/ColorFacet')
import CuboidGeometry = require('../../geometries/CuboidGeometry')
import Drawable = require('../../scene/Drawable')
import Geometry = require('../../geometries/Geometry')
import ISlide = require('../../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IMaterial = require('../../core/IMaterial')
import IDirector = require('../../slideshow/IDirector')
import PointMaterial = require('../../materials/PointMaterial')
import LineMaterial = require('../../materials/LineMaterial')
import MeshMaterial = require('../../materials/MeshMaterial')
import ModelFacet = require('../../models/ModelFacet')
import Shareable = require('../../utils/Shareable')
import Simplex = require('../../geometries/Simplex')
import Vector3 = require('../../math/Vector3')

function createMaterial(geometry: Geometry): IMaterial
{
  switch(geometry.meta.k)
  {
    case Simplex.K_FOR_POINT:
    {
      return new PointMaterial()
    }
    case Simplex.K_FOR_LINE_SEGMENT:
    {
      return new LineMaterial()
    }
    case Simplex.K_FOR_TRIANGLE:
    {
      return new MeshMaterial()
    }
    default: {
      throw new Error('Unexpected dimensions for simplex: ' + geometry.meta.k)
    }
  }
}

class CreateDrawable extends Shareable implements ISlideCommand
{
  private name: string;
  private geometry: Geometry;
  constructor(name: string, geometry: Geometry)
  {
    super('CreateDrawable')
    this.name = name
    this.geometry = geometry
    this.geometry.addRef()
  }
  protected destructor(): void
  {
    this.geometry.release()
    this.geometry = void 0
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector)
  {
    var elements = this.geometry.toElements()
    var material = createMaterial(this.geometry)
    var drawable = new Drawable(elements, material)
    drawable.setFacet('model', new ModelFacet()).decRef()
    drawable.setFacet('color', new ColorFacet()).decRef().setRGB(1, 1, 1)
    director.addDrawable(drawable, this.name)
  }
  undo(slide: ISlide, director: IDirector)
  {
    director.removeDrawable(this.name).release()
  }
}

export = CreateDrawable