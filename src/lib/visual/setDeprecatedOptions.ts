import { Geometry } from '../core/Geometry';
import { isDefined } from '../checks/isDefined';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';

const ATTITUDE_NAME = 'attitude';
const POSITION_NAME = 'position';

/**
 * Deprecated support for 'position' and 'attitude' in options.
 * Implementations should use the corresponding properties instead.
 */
export function setDeprecatedOptions(mesh: Mesh<Geometry, Material>, options: {}): void {
    if (isDefined(options[POSITION_NAME])) {
        console.warn(`options.${POSITION_NAME} is deprecated. Please use the X (position vector) property instead.`);
        mesh.X.copyVector(options[POSITION_NAME]);
    }

    if (isDefined(options[ATTITUDE_NAME])) {
        console.warn(`options.${ATTITUDE_NAME} is deprecated. Please use the R (attitude rotor) property instead.`);
        mesh.R.copySpinor(options[ATTITUDE_NAME]);
    }
}
