import { VectorE3 } from "../math/VectorE3";
import { View } from "./View";

/**
 * @hidden
 */
export interface Frustum extends View {
    left: number;
    right: number;
    bottom: number;
    top: number;
    near: number;
    far: number;
    setEye(eye: VectorE3): Frustum;
    setLook(look: VectorE3): Frustum;
    setUp(up: VectorE3): Frustum;
}
