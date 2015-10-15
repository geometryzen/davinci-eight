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

class CreateCuboidDrawable extends Shareable implements ISlideCommand
{
  private name: string;
  private a: Vector3;
  private b: Vector3;
  private c: Vector3;
  private k: number;
  private subdivide: number;
  private boundary: number;
  constructor(name: string, a: Cartesian3 = Vector3.e1, b: Cartesian3 = Vector3.e2, c: Cartesian3 = Vector3.e3, k: number = Simplex.K_FOR_TRIANGLE, subdivide: number = 0, boundary: number = 0)
  {
    super('CreateCuboidDrawable')
    this.name = name
    this.a = Vector3.copy(a)
    this.b = Vector3.copy(b)
    this.c = Vector3.copy(c)
    this.k = k
    this.subdivide = subdivide
    this.boundary = boundary
  }
  protected destructor(): void
  {
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector)
  {
    var geometry = new CuboidGeometry()
    geometry.a.copy(this.a)
    geometry.b.copy(this.b)
    geometry.c.copy(this.c)
    geometry.k = this.k
    geometry.subdivide(this.subdivide)
    geometry.boundary(this.boundary)
    var elements = geometry.toElements()
    var material = createMaterial(geometry)
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

export = CreateCuboidDrawable