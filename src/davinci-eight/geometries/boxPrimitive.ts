import CuboidPrimitivesBuilder from './CuboidPrimitivesBuilder';
import BoxGeometryOptions from './BoxGeometryOptions';
import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeNumber from '../checks/mustBeNumber';
import Primitive from '../core/Primitive';
import reduce from '../atoms/reduce';

export default function boxPrimitive(options: BoxGeometryOptions = {}): Primitive {

    const builder = new CuboidPrimitivesBuilder()
    builder.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
    builder.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
    builder.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1

    if (isDefined(options.openBack)) {
        builder.openBack = mustBeBoolean('openBack', options.openBack)
    }
    if (isDefined(options.openBase)) {
        builder.openBase = mustBeBoolean('openBase', options.openBase)
    }
    if (isDefined(options.openFront)) {
        builder.openFront = mustBeBoolean('openFront', options.openFront)
    }
    if (isDefined(options.openLeft)) {
        builder.openLeft = mustBeBoolean('openLeft', options.openLeft)
    }
    if (isDefined(options.openRight)) {
        builder.openRight = mustBeBoolean('openRight', options.openRight)
    }
    if (isDefined(options.openCap)) {
        builder.openCap = mustBeBoolean('openCap', options.openCap)
    }

    if (options.tilt) {
        builder.tilt.copySpinor(options.tilt)
    }
    if (options.offset) {
        builder.offset.copy(options.offset)
    }
    return reduce(builder.toPrimitives());
}
