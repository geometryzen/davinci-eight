import { isDefined } from '../checks/isDefined';
import { Camera } from '../facets/Camera';
import { Prism } from '../facets/Prism';
import { dotVectorE3 } from '../math/dotVectorE3';
import { R3, vectorCopy, vectorFromCoords } from '../math/R3';
import { VectorE3 } from '../math/VectorE3';

/**
 * @hidden
 */
function pointerEvents(canvas: HTMLCanvasElement, value: 'auto' | 'none') {
    canvas.style.pointerEvents = value;
}

/**
 * @hidden
 */
function position(canvas: HTMLCanvasElement, value: 'absolute' | 'relative') {
    canvas.style.pointerEvents = value;
}

/**
 * A wrapper around the HTML canvas element that projects from 3D onto the canvas.
 * This utility conveniently integrates with the `PerspectiveCamera` to provide an overlay for WebGL.
 */
export class Diagram3D {
    /**
     * 
     */
    private camera: Camera;
    /**
     * 
     */
    private prism: Prism;
    /**
     * 
     */
    public readonly ctx: CanvasRenderingContext2D;
    /**
     * 
     */
    /**
     * 
     * @param canvas The canvas elementId or the HTML canvas element. 
     * @param camera Provides the camera (eye, look, and up) parameters.
     * @param prism Provides the viewport (near, far, fov, and aspect) parameters.
     */
    constructor(canvas: string | HTMLCanvasElement, camera: Camera, prism: Prism) {
        if (typeof canvas === 'string') {
            const canvasElement = <HTMLCanvasElement>document.getElementById(canvas);
            this.ctx = canvasElement.getContext('2d');
            pointerEvents(canvasElement, 'none');
            position(canvasElement, 'absolute');
        }
        else if (canvas instanceof HTMLCanvasElement) {
            this.ctx = canvas.getContext('2d');
            pointerEvents(canvas, 'none');
            position(canvas, 'absolute');
        }
        else {
            throw new Error("canvas must either be a canvas Id or an HTMLCanvasElement.");
        }
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Helvetica';
        if (isDefined(camera)) {
            if (isDefined(prism)) {
                this.camera = camera;
                this.prism = prism;
            }
            else {
                this.camera = camera;
                this.prism = prism;
            }
        }
    }
    get canvas(): HTMLCanvasElement {
        return this.ctx.canvas;
    }
    get fillStyle(): string | CanvasGradient | CanvasPattern {
        return this.ctx.fillStyle;
    }
    set fillStyle(fillStyle: string | CanvasGradient | CanvasPattern) {
        this.ctx.fillStyle = fillStyle;
    }
    beginPath(): void {
        this.ctx.beginPath();
    }
    clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    closePath(): void {
        this.ctx.closePath();
    }
    fill(fillRule?: "nonzero" | "evenodd"/*CanvasFillRule*/): void {
        this.ctx.fill(fillRule);
    }
    fillText(text: string, X: VectorE3, maxWidth?: number): void {
        const coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillText(text, coords.x, coords.y, maxWidth);
    }
    moveTo(X: VectorE3): void {
        const coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.moveTo(coords.x, coords.y);
    }
    lineTo(X: VectorE3): void {
        const coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.lineTo(coords.x, coords.y);
    }
    stroke(): void {
        this.ctx.stroke();
    }
    strokeText(text: string, X: VectorE3, maxWidth?: number): void {
        const coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeText(text, coords.x, coords.y, maxWidth);
    }
}

/**
 * @hidden
 */
export function canvasCoords(X: VectorE3, camera: { eye: VectorE3; look: VectorE3; up: VectorE3 }, prism: { near: number, far: number, fov: number, aspect: number }, width: number, height: number): { x: number; y: number } {
    const cameraCoords = view(X, camera.eye, camera.look, camera.up);
    const near = prism.near;
    const far = prism.far;
    const fov = prism.fov;
    const aspect = prism.aspect;
    const imageCoords = perspective(cameraCoords, near, far, fov, aspect);
    // Convert image coordinates to screen/device coordinates.
    const x = (imageCoords.x + 1) * width / 2;
    const y = (1 - imageCoords.y) * height / 2;
    return { x, y };
}

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
export function view(X: VectorE3, eye: VectorE3, look: VectorE3, up: VectorE3): Readonly<R3> {
    /**
     * Unit vector towards the camera holder (similar to e3).
     * Some texts call this the w-vector, so that (u, v, w) is a right-handed frame.
     */
    const n = vectorCopy(eye).sub(look).direction();
    /**
     * Unit vector to the right (similar to e1).
     */
    const u = vectorCopy(up).cross(n).direction();
    /**
     * Unit vector upwards (similar to e2).
     */
    const v = n.cross(u);

    const du = - dotVectorE3(eye, u);
    const dv = - dotVectorE3(eye, v);
    const dn = - dotVectorE3(eye, n);

    const x = dotVectorE3(X, u) + du;
    const y = dotVectorE3(X, v) + dv;
    const z = dotVectorE3(X, n) + dn;

    return vectorFromCoords(x, y, z);
}

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
export function perspective(X: VectorE3, n: number, f: number, α: number, aspect: number): Readonly<R3> {
    /**
     * The camera coordinates (u, v, w).
     */
    const u = X.x;
    const v = X.y;
    const w = X.z;

    /**
     * tangent of one half the field of view angle.
     */
    const t = Math.tan(α / 2);
    const negW = -w;

    const x = u / (negW * aspect * t);
    const y = v / (negW * t);
    const z = ((f + n) * w + 2 * f * n) / (w * (f - n));

    return vectorFromCoords(x, y, z);
}
