import BoxOptions from './BoxOptions'
import isDefined from '../checks/isDefined'
import VectorE3 from '../math/VectorE3'
import Vector3 from '../math/Vector3'

export default function(options: BoxOptions): VectorE3 {
    const x = isDefined(options.width) ? options.width : 1
    return Vector3.vector(x, 0, 0)
}
