import VectorE3 = require('../math/VectorE3')
import IGeometry = require('../geometries/IGeometry')

interface IAxialGeometry<T> extends IGeometry<T>  {
  setAxis(axis: VectorE3): T
}

export = IAxialGeometry