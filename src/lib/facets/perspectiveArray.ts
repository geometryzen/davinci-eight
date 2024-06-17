import { mustBeNumber } from "../checks/mustBeNumber";
import { frustumMatrix } from "./frustumMatrix";

/**
 * Computes the matrix for the viewing transformation.
 * @param fov The angle subtended at the apex of the viewing pyramid.
 * @param aspect The ratio of width / height of the viewing pyramid.
 * @param near The distance from the camera eye point to the near plane.
 * @param far The distance from the camera eye point to the far plane.
 * @hidden
 */
export function perspectiveArray(fov: number, aspect: number, near: number, far: number, matrix?: Float32Array): Float32Array {
    // We can leverage the frustum function, although technically the
    // symmetry in this perspective transformation should reduce the amount
    // of computation required.
    mustBeNumber("fov", fov);
    mustBeNumber("aspect", aspect);
    mustBeNumber("near", near);
    mustBeNumber("far", far);

    const ymax = near * Math.tan(fov * 0.5); // top
    const ymin = -ymax; // bottom
    const xmin = ymin * aspect; // left
    const xmax = ymax * aspect; // right

    return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
}
