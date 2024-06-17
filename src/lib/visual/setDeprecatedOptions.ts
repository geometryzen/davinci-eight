import { isDefined } from "../checks/isDefined";
import { Geometry } from "../core/Geometry";
import { Material } from "../core/Material";
import { Mesh } from "../core/Mesh";
import { SpinorE3 } from "../math/SpinorE3";
import { VectorE3 } from "../math/VectorE3";

/**
 * @hidden
 */
const ATTITUDE_NAME = "attitude";
/**
 * @hidden
 */
const POSITION_NAME = "position";

/**
 * Deprecated support for 'position' and 'attitude' in options.
 * Implementations should use the corresponding properties instead.
 * @hidden
 */
export function setDeprecatedOptions(mesh: Mesh<Geometry, Material>, options: Record<string, unknown>): void {
    if (isDefined(options[POSITION_NAME])) {
        console.warn(`options.${POSITION_NAME} is deprecated. Please use the X (position vector) property instead.`);
        mesh.X.copyVector(options[POSITION_NAME] as VectorE3);
    }

    if (isDefined(options[ATTITUDE_NAME])) {
        console.warn(`options.${ATTITUDE_NAME} is deprecated. Please use the R (attitude rotor) property instead.`);
        mesh.R.copySpinor(options[ATTITUDE_NAME] as SpinorE3);
    }
}
