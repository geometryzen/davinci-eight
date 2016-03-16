import View from './View';
import VectorE3 from '../math/VectorE3';

interface Perspective extends View {
    fov: number;
    aspect: number;
    near: number;
    far: number;
    setFov(fov: number): Perspective;
    setAspect(aspect: number): Perspective;
    setNear(near: number): Perspective;
    setFar(far: number): Perspective;
    setEye(eye: VectorE3): Perspective;
    setLook(look: VectorE3): Perspective;
    setUp(up: VectorE3): Perspective;
}

export default Perspective;
