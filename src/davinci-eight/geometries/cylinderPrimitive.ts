import CylinderBuilder from './CylinderBuilder';
import CylinderGeometryOptions from './CylinderGeometryOptions';
import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import Primitive from '../core/Primitive';
import Vector3 from '../math/Vector3';
import reduce from '../atoms/reduce';

export default function cylinderPrimitive(options: CylinderGeometryOptions = {}): Primitive {

    const builder = new CylinderBuilder(Vector3.vector(0, 1, 0), Vector3.vector(0, 0, 1), false);

    if (isDefined(options.openBase)) {
        builder.openBase = mustBeBoolean('openBase', options.openBase);
    }
    if (isDefined(options.openCap)) {
        builder.openCap = mustBeBoolean('openCap', options.openCap);
    }
    if (isDefined(options.openWall)) {
        builder.openWall = mustBeBoolean('openWall', options.openWall);
    }

    //        builder.stress.copy(stress)
    if (options.tilt) {
        builder.tilt.copySpinor(options.tilt);
    }
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    return reduce(builder.toPrimitives());
}
