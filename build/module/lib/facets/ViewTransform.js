import { GraphicsProgramSymbols as ProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { viewMatrixFromEyeLookUp } from './viewMatrixFromEyeLookUp';
/**
 * @hidden
 */
var ViewTransform = /** @class */ (function () {
    /**
     *
     */
    function ViewTransform() {
        /**
         *
         */
        this._eye = Geometric3.vector(0, 0, 1);
        /**
         *
         */
        this._look = Geometric3.vector(0, 0, 0);
        /**
         *
         */
        this._up = Geometric3.vector(0, 1, 0);
        /**
         *
         */
        this._matrix = Matrix4.one.clone();
        /**
         *
         */
        this.matrixName = ProgramSymbols.UNIFORM_VIEW_MATRIX;
        this._eye.modified = true;
        this._look.modified = true;
        this._up.modified = true;
    }
    /**
     *
     */
    ViewTransform.prototype.cameraToWorldCoords = function (cameraCoords) {
        // TODO: Pick the coordinates of n, u, v out of the matrix?
        var n = Vector3.copy(this.eye).sub(this.look).normalize();
        var u = Vector3.copy(this.up).cross(n).normalize();
        var v = Vector3.copy(n).cross(u).normalize();
        var u0 = cameraCoords[0];
        var u1 = cameraCoords[1];
        var u2 = cameraCoords[2];
        return this.eye.clone().addVector(u, u0).addVector(v, u1).addVector(n, u2);
    };
    /**
     *
     */
    ViewTransform.prototype.setUniforms = function (visitor) {
        this.refreshMatrix();
        visitor.matrix4fv(this.matrixName, this._matrix.elements, false);
    };
    Object.defineProperty(ViewTransform.prototype, "viewMatrixUniformName", {
        /**
         * The name of the uniform mat4 variable in the vertex shader that receives the view matrix value.
         * The default name is `uView`.
         */
        get: function () {
            return this.matrixName;
        },
        set: function (name) {
            this.matrixName = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewTransform.prototype, "eye", {
        /**
         * The position of the camera, a vector.
         */
        get: function () {
            return this._eye;
        },
        set: function (eye) {
            this._eye.copyVector(eye);
            this.refreshMatrix();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewTransform.prototype, "look", {
        /**
         * The point that is being looked at.
         */
        get: function () {
            return this._look;
        },
        set: function (look) {
            this._look.copyVector(look);
            this.refreshMatrix();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewTransform.prototype, "up", {
        /**
         * The approximate up direction.
         */
        get: function () {
            return this._up;
        },
        set: function (up) {
            this._up.copyVector(up);
            this.refreshMatrix();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewTransform.prototype, "matrix", {
        get: function () {
            // This is a bit of a hack because what we really need is for changes to the
            // eye, look, and up vectors to fire events. This is because it is possible
            // to mutate these vectors.
            this.refreshMatrix();
            return this._matrix;
        },
        enumerable: false,
        configurable: true
    });
    ViewTransform.prototype.refreshMatrix = function () {
        if (this._eye.modified || this._look.modified || this._up.modified) {
            viewMatrixFromEyeLookUp(this._eye, this._look, this._up, this._matrix);
            this._eye.modified = false;
            this._look.modified = false;
            this._up.modified = false;
        }
    };
    return ViewTransform;
}());
export { ViewTransform };
