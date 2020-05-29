import { dotVectorE3 } from '../math/dotVectorE3';
import { isDefined } from '../checks/isDefined';
import { vectorFromCoords, vectorCopy } from '../math/R3';
/**
 *
 */
var Diagram3D = /** @class */ (function () {
    /**
     *
     */
    function Diagram3D(canvas, camera, prism) {
        if (typeof canvas === 'string') {
            var canvasElement = document.getElementById(canvas);
            this.ctx = canvasElement.getContext('2d');
        }
        else if (canvas instanceof HTMLCanvasElement) {
            this.ctx = canvas.getContext('2d');
        }
        else {
            throw new Error("canvas must either be a canvas Id or an HTMLCanvasElement.");
        }
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Helvetica';
        if (isDefined(camera)) {
            if (isDefined(prism)) {
                this.camera = camera;
                this.prism = prism;
            }
            else {
                this.camera = camera;
                this.prism = camera;
            }
        }
    }
    Object.defineProperty(Diagram3D.prototype, "canvas", {
        get: function () {
            return this.ctx.canvas;
        },
        enumerable: false,
        configurable: true
    });
    Diagram3D.prototype.beginPath = function () {
        this.ctx.beginPath();
    };
    Diagram3D.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };
    Diagram3D.prototype.closePath = function () {
        this.ctx.closePath();
    };
    Diagram3D.prototype.fill = function (fillRule /*CanvasFillRule*/) {
        this.ctx.fill(fillRule);
    };
    Diagram3D.prototype.fillText = function (text, X, maxWidth) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillText(text, coords.x, coords.y, maxWidth);
    };
    Diagram3D.prototype.moveTo = function (X) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.moveTo(coords.x, coords.y);
    };
    Diagram3D.prototype.lineTo = function (X) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.lineTo(coords.x, coords.y);
    };
    Diagram3D.prototype.stroke = function () {
        this.ctx.stroke();
    };
    Diagram3D.prototype.strokeText = function (text, X, maxWidth) {
        var coords = canvasCoords(X, this.camera, this.prism, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeText(text, coords.x, coords.y, maxWidth);
    };
    return Diagram3D;
}());
export { Diagram3D };
/**
 *
 */
export function canvasCoords(X, camera, prism, width, height) {
    var cameraCoords = view(X, camera.eye, camera.look, camera.up);
    var near = prism.near;
    var far = prism.far;
    var fov = prism.fov;
    var aspect = prism.aspect;
    var imageCoords = perspective(cameraCoords, near, far, fov, aspect);
    // Convert image coordinates to screen/device coordinates.
    var x = (imageCoords.x + 1) * width / 2;
    var y = (1 - imageCoords.y) * height / 2;
    return { x: x, y: y };
}
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
export function view(X, eye, look, up) {
    /**
     * Unit vector towards the camera holder (similar to e3).
     * Some texts call this the w-vector, so that (u, v, w) is a right-handed frame.
     */
    var n = vectorCopy(eye).sub(look).direction();
    /**
     * Unit vector to the right (similar to e1).
     */
    var u = vectorCopy(up).cross(n).direction();
    /**
     * Unit vector upwards (similar to e2).
     */
    var v = n.cross(u);
    var du = -dotVectorE3(eye, u);
    var dv = -dotVectorE3(eye, v);
    var dn = -dotVectorE3(eye, n);
    var x = dotVectorE3(X, u) + du;
    var y = dotVectorE3(X, v) + dv;
    var z = dotVectorE3(X, n) + dn;
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
 */
export function perspective(X, n, f, α, aspect) {
    /**
     * The camera coordinates (u, v, w).
     */
    var u = X.x;
    var v = X.y;
    var w = X.z;
    /**
     * tangent of one half the field of view angle.
     */
    var t = Math.tan(α / 2);
    var negW = -w;
    var x = u / (negW * aspect * t);
    var y = v / (negW * t);
    var z = ((f + n) * w + 2 * f * n) / (w * (f - n));
    return vectorFromCoords(x, y, z);
}
