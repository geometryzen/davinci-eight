import VectorE3 from '../math/VectorE3';
import IPrimitivesBuilder from '../geometries/IPrimitivesBuilder';

interface IAxialGeometry<T> extends IPrimitivesBuilder<T> {
    setAxis(axis: VectorE3): T
}

export default IAxialGeometry
