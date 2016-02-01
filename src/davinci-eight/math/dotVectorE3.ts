import dotVectorCartesianE3 from '../math/dotVectorCartesianE3';
import VectorE3 from '../math/VectorE3';
import isDefined from '../checks/isDefined';

export default function dotVectorE3(a: VectorE3, b: VectorE3): number {
    if (isDefined(a) && isDefined(b)) {
        return dotVectorCartesianE3(a.x, a.y, a.z, b.x, b.y, b.z)
    }
    else {
        return void 0
    }
}
