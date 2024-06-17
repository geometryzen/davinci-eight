import { isDefined } from "../checks/isDefined";
import { Geometry } from "../core/Geometry";
import { Material } from "../core/Material";
import { Mesh } from "../core/Mesh";
import { VectorE3 } from "../math/VectorE3";

/**
 * Sets the axis and meridian properties from options in the correct order.
 * @hidden
 */
export function setAxisAndMeridian(mesh: Mesh<Geometry, Material>, options: { axis?: VectorE3; meridian?: VectorE3 }): void {
    if (isDefined(options.axis)) {
        mesh.axis = options.axis;
    }

    if (isDefined(options.meridian)) {
        mesh.meridian = options.meridian;
    }
}
