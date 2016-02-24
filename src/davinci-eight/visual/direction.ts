import VectorE3 from '../math/VectorE3'
import R3 from '../math/R3'

export default function(options: { axis?: VectorE3 }): R3 {
    if (options.axis) {
        return R3.direction(options.axis)
    }
    else {
        return R3.e3
    }
}
