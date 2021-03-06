import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
/**
 * A framework, as a base class, for building primitives by applying transformations to vertices.
 */
var PrimitivesBuilder = /** @class */ (function () {
    function PrimitivesBuilder() {
        /**
         *
         */
        this.zenith = Vector3.vector(0, 1, 0);
        /**
         *
         */
        this.meridian = Vector3.vector(0, 0, 1);
        /**
         * The scaling to apply to the geometry in the initial configuration.
         * This has a slightly strange sounding name because it involves a
         * reference frame specific transformation.
         *
         * This may be replaced by a Matrix3 in future.
         */
        this.stress = Vector3.vector(1, 1, 1);
        /**
         * The rotation to apply to the geometry (after the stress has been applied).
         */
        this.tilt = Spinor3.one.clone();
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
    /**
     * Applies the transforms defined in this class to the vertex specified.
     */
    PrimitivesBuilder.prototype.applyTransforms = function (vertex, i, j, iLength, jLength) {
        var tLen = this.transforms.length;
        for (var t = 0; t < tLen; t++) {
            this.transforms[t].exec(vertex, i, j, iLength, jLength);
        }
    };
    /**
     * Derived classes must implement.
     */
    PrimitivesBuilder.prototype.toPrimitives = function () {
        console.warn("toPrimitives() must be implemented by derived classes.");
        return [];
    };
    return PrimitivesBuilder;
}());
export { PrimitivesBuilder };
