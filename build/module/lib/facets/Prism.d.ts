export interface Prism {
    /**
     * The distance to the near plane of the viewport.
     */
    near: number;
    /**
     * The distance to the far plane of the viewport.
     */
    far: number;
    /**
     * The field of view is the angle in the camera horizontal plane that the viewport subtends at the camera.
     * The field of view is measured in radians.
     */
    fov: number;
    /**
     * The aspect ratio of the viewport, i.e., width / height.
     */
    aspect: number;
}
