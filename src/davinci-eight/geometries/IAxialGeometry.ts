import VectorE3 from '../math/VectorE3';
import IGeometry from '../geometries/IGeometry';

interface IAxialGeometry<T> extends IGeometry<T> {
    setAxis(axis: VectorE3): T
}

export default IAxialGeometry