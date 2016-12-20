import { Geometry } from '../core/Geometry';
import isDefined from '../checks/isDefined';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import VectorE3 from '../math/VectorE3';

/**
 * Sets the axis and meridian properties from options in the correct order.
 */
export default function setAxisAndMeridian(mesh: Mesh<Geometry, Material>, options: { axis?: VectorE3; meridian?: VectorE3 }): void {

    if (isDefined(options.axis)) {
        this.axis = options.axis;
    }

    if (isDefined(options.meridian)) {
        this.meridian = options.meridian;
    }
}
