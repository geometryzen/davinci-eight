import Geometry = require('../geometries/Geometry')
import ISlide = require('../slideshow/ISlide')
import ISlideCommand = require('../slideshow/ISlideCommand')
import IDirector = require('../slideshow/IDirector')
import Shareable = require('../utils/Shareable')

class GeometryCommand extends Shareable implements ISlideCommand {
  private name: string;
  private geometry: Geometry;
  constructor(name: string, geometry: Geometry) {
    super('GeometryCommand')
    this.name = name
    this.geometry = geometry
    this.geometry.addRef()
  }
  protected destructor(): void {
    this.geometry.release()
    this.geometry = void 0
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector) {
    director.addGeometry(this.name, this.geometry)
  }
  undo(slide: ISlide, director: IDirector) {
    director.removeGeometry(this.name).release()
  }
}

export = GeometryCommand