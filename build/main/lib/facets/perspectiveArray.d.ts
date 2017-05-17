/**
 * Computes the matrix for the viewing transformation.
 * @param fov The angle subtended at the apex of the viewing pyramid.
 * @param aspect The ratio of width / height of the viewing pyramid.
 * @param near The distance from the camera eye point to the near plane.
 * @param far The distance from the camera eye point to the far plane.
 */
export declare function perspectiveArray(fov: number, aspect: number, near: number, far: number, matrix?: Float32Array): Float32Array;
