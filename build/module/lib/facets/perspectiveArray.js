import { frustumMatrix } from './frustumMatrix';
import { mustBeNumber } from '../checks/mustBeNumber';
/**
 * Computes the matrix for the viewing transformation.
 * @param fov The angle subtended at the apex of the viewing pyramid.
 * @param aspect The ratio of width / height of the viewing pyramid.
 * @param near The distance from the camera eye point to the near plane.
 * @param far The distance from the camera eye point to the far plane.
 */
export function perspectiveArray(fov, aspect, near, far, matrix) {
    // We can leverage the frustum function, although technically the
    // symmetry in this perspective transformation should reduce the amount
    // of computation required.
    mustBeNumber('fov', fov);
    mustBeNumber('aspect', aspect);
    mustBeNumber('near', near);
    mustBeNumber('far', far);
    var ymax = near * Math.tan(fov * 0.5); // top
    var ymin = -ymax; // bottom
    var xmin = ymin * aspect; // left
    var xmax = ymax * aspect; // right
    return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
}
