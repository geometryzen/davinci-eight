import Cartesian3 = require('../math/Cartesian3')
import IGeometry = require('../geometries/IGeometry')

interface IAxialGeometry<T> extends IGeometry<T>  {
  setAxis(axis: Cartesian3): T
}

export = IAxialGeometry