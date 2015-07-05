import Camera = require('./Camera');
/**
 *
 */
declare class PerspectiveCamera extends Camera {
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
}
export = PerspectiveCamera;
