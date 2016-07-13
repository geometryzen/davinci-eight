import Primitive from '../core/Primitive';
import reduce from '../atoms/reduce';
import SphereBuilder from './SphereBuilder';
import SphereGeometryOptions from './SphereGeometryOptions';

export default function spherePrimitive(options: SphereGeometryOptions = {}): Primitive {
    const builder = new SphereBuilder();
    // FIXME: options aren't being used:
    // options.engine;
    // options.offset;
    // options.stress;
    // options.tilt;
    return reduce(builder.toPrimitives());
}
