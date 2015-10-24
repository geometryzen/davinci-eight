import VectorE3 = require('../../math/VectorE3')

import ColorFacet = require('../../uniforms/ColorFacet')
import CuboidSimplexGeometry = require('../../geometries/CuboidSimplexGeometry')
import Drawable = require('../../scene/Drawable')
import SimplexGeometry = require('../../geometries/SimplexGeometry')
import ISlide = require('../../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IMaterial = require('../../core/IMaterial')
import IDirector = require('../../slideshow/IDirector')
import EmptyMaterial = require('../../materials/EmptyMaterial')
import PointMaterial = require('../../materials/PointMaterial')
import LineMaterial = require('../../materials/LineMaterial')
import MeshMaterial = require('../../materials/MeshMaterial')
import ModelFacet = require('../../models/ModelFacet')
import Shareable = require('../../utils/Shareable')
import Simplex = require('../../geometries/Simplex')
import R3 = require('../../math/R3')

function createMaterial(geometry: SimplexGeometry): IMaterial
{
  switch(geometry.meta.k)
  {
    case Simplex.TRIANGLE:
    {
      return new MeshMaterial()
    }
    case Simplex.LINE:
    {
      return new LineMaterial()
    }
    case Simplex.POINT:
    {
      return new PointMaterial()
    }
    case Simplex.EMPTY:
    {
      return new EmptyMaterial()
    }
    default: {
      throw new Error('Unexpected dimensionality for simplex: ' + geometry.meta.k)
    }
  }
}

class CreateDrawable extends Shareable implements ISlideCommand
{
  private name: string;
  private geometry: SimplexGeometry;
  constructor(name: string, geometry: SimplexGeometry)
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
    var primitives = this.geometry.toPrimitives()
    var material = createMaterial(this.geometry)
    var drawable = new Drawable(primitives, material)
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