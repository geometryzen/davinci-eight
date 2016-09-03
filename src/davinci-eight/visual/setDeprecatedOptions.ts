import {Geometry} from '../core/Geometry';
import isDefined from '../checks/isDefined';
import {Material} from '../core/Material';
import {Mesh} from '../core/Mesh';
import VisualOptions from './VisualOptions';

const ATTITUDE_NAME = 'attitude';
const POSITION_NAME = 'position';

export default function setDeprecatedOptions(mesh: Mesh<Geometry, Material>, options: VisualOptions): void {
    if (isDefined(options[POSITION_NAME])) {
        console.warn(`options.${POSITION_NAME} is deprecated. Please use the X (position vector) property instead.`);
        mesh.X.copyVector(options[POSITION_NAME]);
    }

    if (isDefined(options[ATTITUDE_NAME])) {
        console.warn(`options.${ATTITUDE_NAME} is deprecated. Please use the R (attitude rotor) property instead.`);
        mesh.R.copySpinor(options[ATTITUDE_NAME]);
    }
}
