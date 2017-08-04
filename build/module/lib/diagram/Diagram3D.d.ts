import { R3 } from '../math/R3';
import { VectorE3 } from '../math/VectorE3';
/**
 *
 */
export declare class Diagram3D {
    /**
     *
     */
    private camera;
    /**
     *
     */
    private prism;
    /**
     *
     */
    ctx: CanvasRenderingContext2D;
    /**
     *
     */
    constructor(canvas: string | HTMLCanvasElement, camera: {
        eye: VectorE3;
        look: VectorE3;
        up: VectorE3;
        near: number;
        far: number;
        fov: number;
        aspect: number;
    }, prism?: {
        near: number;
        far: number;
        fov: number;
        aspect: number;
    });
    readonly canvas: HTMLCanvasElement;
    beginPath(): void;
    clear(): void;
    closePath(): void;
    fill(fillRule?: "nonzero" | "evenodd"): void;
    fillText(text: string, X: VectorE3, maxWidth?: number): void;
    moveTo(X: VectorE3): void;
    lineTo(X: VectorE3): void;
    stroke(): void;
    strokeText(text: string, X: VectorE3, maxWidth?: number): void;
}
/**
 *
 */
export declare function canvasCoords(X: VectorE3, camera: {
    eye: VectorE3;
    look: VectorE3;
    up: VectorE3;
}, prism: {
    near: number;
    far: number;
    fov: number;
    aspect: number;
}, width: number, height: number): {
    x: number;
    y: number;
};
/**
 * View transformation converts world coordinates to camera frame coordinates.
 * We first compute the camera frame (u, v, w, eye), then solve the equation
 * X = x * u + y * v * z * n + eye
 *
 * @param X The world vector.
 * @param eye The position of the camera.
 * @param look The point that the camera is aimed at.
 * @param up The approximate up direction.
 * @returns The coordinates in the camera (u, v, w) basis.
 */
export declare function view(X: VectorE3, eye: VectorE3, look: VectorE3, up: VectorE3): Readonly<R3>;
/**
 * Perspective transformation projects camera coordinates onto the image space.
 * The near plane corresponds to -1. The far plane corresponds to +1.
 *
 * @param X The coordinates in the camera frame.
 * @param n The distance from the camera eye to the near plane onto which X is projected.
 * @param f The distance to the far plane.
 * @param α The angle subtended at the apex of the pyramid in the vw-plane.
 * @param aspect The ratio of the width to the height (width divided by height).
 */
export declare function perspective(X: VectorE3, n: number, f: number, α: number, aspect: number): Readonly<R3>;
