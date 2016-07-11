import frustumMatrix from './frustumMatrix';
import mustBeNumber from '../checks/mustBeNumber';

export default function perspectiveArray(fov: number, aspect: number, near: number, far: number, matrix?: Float32Array): Float32Array {
    // We can leverage the frustum function, although technically the
    // symmetry in this perspective transformation should reduce the amount
    // of computation required.
    mustBeNumber('fov', fov);
    mustBeNumber('aspect', aspect);
    mustBeNumber('near', near);
    mustBeNumber('far', far);

    const ymax = near * Math.tan(fov * 0.5);   // top
    const ymin = - ymax;                       // bottom
    const xmin = ymin * aspect;                // left
    const xmax = ymax * aspect;                // right

    return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
}
