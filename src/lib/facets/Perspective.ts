import { Matrix4 } from '../math/Matrix4';
import { VectorE3 } from '../math/VectorE3';
import { View } from './View';

/**
 * @hidden
 */
export interface Perspective extends View {
    fov: number;
    aspect: number;
    near: number;
    far: number;
    projectionMatrix: Matrix4;
    setFov(fov: number): Perspective;
    setAspect(aspect: number): Perspective;
    setNear(near: number): Perspective;
    setFar(far: number): Perspective;
    setEye(eye: VectorE3): Perspective;
    setLook(look: VectorE3): Perspective;
    setUp(up: VectorE3): Perspective;
    updateProjectionMatrix(): void;
}
