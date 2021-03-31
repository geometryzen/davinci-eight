import { Camera } from '../facets/Camera';
import { Prism } from '../facets/Prism';
import { R3 } from '../math/R3';
import { VectorE3 } from '../math/VectorE3';
/**
 * A wrapper around the HTML canvas element that projects from 3D onto the canvas.
 * This utility conveniently integrates with the `PerspectiveCamera` to provide an overlay for WebGL.
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
    readonly ctx: CanvasRenderingContext2D;
    /**
     *
     */
    /**
     *
     * @param canvas The canvas elementId or the HTML canvas element.
     * @param camera Provides the camera (eye, look, and up) parameters.
     * @param prism Provides the viewport (near, far, fov, and aspect) parameters.
     */
    constructor(canvas: string | HTMLCanvasElement, camera: Camera, prism: Prism);
    get canvas(): HTMLCanvasElement;
    get fillStyle(): string | CanvasGradient | CanvasPattern;
    set fillStyle(fillStyle: string | CanvasGradient | CanvasPattern);
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
 * @hidden
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
 * @hidden
 *
 * @param X The world vector.
 * @param eye The position of the camera.
 * @param look The point that the camera is aimed at.
 * @param up The approximate up direction.
 * @returns The coordinates in the camera (u, v, w) basis.
 * @hidden
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
 * @hidden
 */
export declare function perspective(X: VectorE3, n: number, f: number, α: number, aspect: number): Readonly<R3>;
