import { __extends } from "tslib";
import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector3 } from '../math/Vector3';
import { Approximation } from '../transforms/Approximation';
import { ConeTransform } from '../transforms/ConeTransform';
import { CoordsTransform2D } from '../transforms/CoordsTransform2D';
import { Direction } from '../transforms/Direction';
import { Duality } from '../transforms/Duality';
import { Rotation } from '../transforms/Rotation';
import { Scaling } from '../transforms/Scaling';
import { Translation } from '../transforms/Translation';
import { AxialShapeBuilder } from './AxialShapeBuilder';
/**
 * @hidden
 */
var ConicalShellBuilder = /** @class */ (function (_super) {
    __extends(ConicalShellBuilder, _super);
    function ConicalShellBuilder() {
        var _this = _super.call(this) || this;
        /**
         *
         */
        _this.radialSegments = 1;
        /**
         *
         */
        _this.thetaSegments = 32;
        _this.height = Vector3.vector(0, 1, 0);
        _this.cutLine = Vector3.vector(0, 0, 1);
        _this.clockwise = true;
        return _this;
    }
    /**
     *
     */
    ConicalShellBuilder.prototype.toPrimitive = function () {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        var aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        var aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        var aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
        var coneTransform = new ConeTransform(this.clockwise, this.sliceAngle, aPosition, aTangent);
        coneTransform.h.copy(this.height);
        coneTransform.a.copy(this.cutLine);
        coneTransform.b.copy(this.height).normalize().cross(this.cutLine);
        this.transforms.push(coneTransform);
        this.transforms.push(new Scaling(this.stress, [aPosition, aTangent]));
        this.transforms.push(new Rotation(this.tilt, [aPosition, aTangent]));
        this.transforms.push(new Translation(this.offset, [aPosition]));
        // Use a duality transformation with a sign change to convert the tangent planes to vectors.
        this.transforms.push(new Duality(aTangent, aNormal, true, true));
        // Normalize the normal vectors.
        this.transforms.push(new Direction(aNormal));
        // Discard insignificant coordinates.
        this.transforms.push(new Approximation(9, [aPosition, aNormal]));
        if (this.useTextureCoord) {
            this.transforms.push(new CoordsTransform2D(false, false, false));
        }
        var grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments);
        var iLength = grid.uLength;
        for (var i = 0; i < iLength; i++) {
            var jLength = grid.vLength;
            for (var j = 0; j < jLength; j++) {
                this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength);
            }
        }
        return grid.toPrimitive();
    };
    return ConicalShellBuilder;
}(AxialShapeBuilder));
export { ConicalShellBuilder };
