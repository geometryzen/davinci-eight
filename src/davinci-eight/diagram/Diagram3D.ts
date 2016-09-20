import VectorE3 from '../math/VectorE3';
import dotVectorE3 from '../math/dotVectorE3';
import vec from '../math/R3';

export default class Diagram3D {
    public ctx: CanvasRenderingContext2D;
    constructor(canvas: string, private camera: { eye: VectorE3; look: VectorE3; up: VectorE3; near: number, far: number, fov: number, aspect: number }) {
        const canvasElement = <HTMLCanvasElement>document.getElementById('canvas2D');
        this.ctx = canvasElement.getContext('2d');
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Helvetica';
    }
    get canvas(): HTMLCanvasElement {
        return this.ctx.canvas;
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
    fill(fillRule?: string): void {
        this.ctx.fill(fillRule);
    }
    fillText(text: string, X: VectorE3, maxWidth?: number): void {
        const coords = this.canvasCoords(X);
        this.ctx.fillText(text, coords.x, coords.y, maxWidth);
    }
    moveTo(X: VectorE3): void {
        const coords = this.canvasCoords(X);
        this.ctx.moveTo(coords.x, coords.y);
    }
    lineTo(X: VectorE3): void {
        const coords = this.canvasCoords(X);
        this.ctx.lineTo(coords.x, coords.y);
    }
    stroke(): void {
        this.ctx.stroke();
    }
    private canvasCoords(X: VectorE3) {
        const camera = this.camera;
        const cameraCoords = view(X, camera.eye, camera.look, camera.up);
        const N = camera.near;
        const F = camera.far;
        const θ = camera.fov;
        const aspect = camera.aspect;
        const canonCoords = perspective(cameraCoords, N, F, θ, aspect);
        const x = (canonCoords.x + 1) * this.ctx.canvas.width / 2;
        const y = (canonCoords.y - 1) * -this.ctx.canvas.height / 2;
        return { x, y };
    }
}


/**
 * View transformation converts world coordinates to camera frame coordinates.
 */
function view(X: VectorE3, eye: VectorE3, look: VectorE3, up: VectorE3) {

    const e = vec(eye.x, eye.y, eye.z);
    const l = vec(look.x, look.y, look.z);
    const n = e.sub(l).direction();
    const u = vec(up.x, up.y, up.z).cross(n).direction();
    const v = n.cross(u);

    const du = - dotVectorE3(eye, u);
    const dv = - dotVectorE3(eye, v);
    const dn = - dotVectorE3(eye, n);

    const x = dotVectorE3(X, u) + du;
    const y = dotVectorE3(X, v) + dv;
    const z = dotVectorE3(X, n) + dn;

    return { x, y, z };
}

/**
 * Perspective transformation projects camera coordinates onto the near plane.
 */
function perspective(X: VectorE3, N: number, F: number, fov: number, aspect: number) {
    const t = N * Math.tan(fov / 2);
    const b = -t;
    const r = aspect * t;
    const l = -r;
    // x simplifies because l = -r;
    const x = N * X.x / (X.z * l);
    const y = ((2 * N) * X.y + (t + b) * X.z) / (-X.z * (t - b));
    const z = (-(F + N) * X.z - 2 * F * N) / (-X.z * (F - N))
    return { x, y, z };
}
