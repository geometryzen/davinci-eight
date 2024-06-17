import { isDefined } from "../checks/isDefined";
import { Vector3 } from "../math/Vector3";
import { VectorE3 } from "../math/VectorE3";
import { BoxOptions } from "./BoxOptions";

/**
 * @hidden
 */
export function scaleFromBoxOptions(options: BoxOptions): VectorE3 {
    const x = isDefined(options.width) ? options.width : 1;
    return Vector3.vector(x, 0, 0);
}
