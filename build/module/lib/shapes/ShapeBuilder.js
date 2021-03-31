import { Geometric3 } from '../math/Geometric3';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
var ShapeBuilder = /** @class */ (function () {
    /**
     *
     */
    function ShapeBuilder() {
        /**
         * The scaling to apply to the geometry in the initial configuration.
         * This has a slightly strange sounding name because it involves a
         * reference frame specific transformation.
         *
         * This may be replaced by a Matrix3 in future.
         */
        this.stress = Vector3.vector(1, 1, 1);
        /**
         * The rotor to apply to the geometry (after scale has been applied).
         */
        this.tilt = Geometric3.one(false);
        /**
         * The translation to apply to the geometry (after tilt has been applied).
         */
        this.offset = Vector3.zero();
        /**
         *
         */
        this.transforms = [];
        /**
         * Determines whether to include normals in the geometry.
         */
        this.useNormal = true;
        /**
         * Determines whether to include positions in the geometry.
         */
        this.usePosition = true;
        /**
         * Determines whether to include texture coordinates in the geometry.
         */
        this.useTextureCoord = false;
        // Do nothing.
    }
    ShapeBuilder.prototype.applyTransforms = function (vertex, i, j, iLength, jLength) {
        var tLen = this.transforms.length;
        for (var t = 0; t < tLen; t++) {
            this.transforms[t].exec(vertex, i, j, iLength, jLength);
        }
    };
    return ShapeBuilder;
}());
export { ShapeBuilder };
