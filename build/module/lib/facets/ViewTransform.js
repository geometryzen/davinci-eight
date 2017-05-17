import { Geometric3 } from '../math/Geometric3';
import { GraphicsProgramSymbols as ProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { viewMatrixFromEyeLookUp } from './viewMatrixFromEyeLookUp';
/**
 *
 */
var ViewTransform = (function () {
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
        this.matrix = Matrix4.one.clone();
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
        if (this._eye.modified || this._look.modified || this._up.modified) {
            viewMatrixFromEyeLookUp(this._eye, this._look, this._up, this.matrix);
            this._eye.modified = false;
            this._look.modified = false;
            this._up.modified = false;
        }
        visitor.matrix4fv(this.matrixName, this.matrix.elements, false);
    };
    Object.defineProperty(ViewTransform.prototype, "eye", {
        /**
         * The position of the camera, a vector.
         */
        get: function () {
            return this._eye;
        },
        set: function (eye) {
            this._eye.copyVector(eye);
        },
        enumerable: true,
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
        },
        enumerable: true,
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
        },
        enumerable: true,
        configurable: true
    });
    return ViewTransform;
}());
export { ViewTransform };
