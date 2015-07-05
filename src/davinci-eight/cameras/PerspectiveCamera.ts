import Camera = require('./Camera');
/**
 *
 */
class PerspectiveCamera extends Camera {
  constructor(fov: number = 75, aspect: number = 1, near: number = 0.1, far: number = 2000) {
    super();
    this.projectionMatrix.makePerspective(fov, aspect, near, far);
  }
}

export = PerspectiveCamera;