import frustumMatrix from './frustumMatrix';
import expectArg from '../checks/expectArg';

export default function perspectiveArray(fov: number, aspect: number, near: number, far: number, matrix?: Float32Array): Float32Array {
    // We can leverage the frustum function, although technically the
    // symmetry in this perspective transformation should reduce the amount
    // of computation required.

    expectArg('fov', fov).toBeNumber();
    expectArg('aspect', aspect).toBeNumber();
    expectArg('near', near).toBeNumber();
    expectArg('far', far).toBeNumber();

    let ymax: number = near * Math.tan(fov * 0.5);   // top
    let ymin: number = - ymax;                       // bottom
    let xmin: number = ymin * aspect;                // left
    let xmax: number = ymax * aspect;                // right

    return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
}
