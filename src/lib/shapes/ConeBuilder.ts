import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Primitive } from '../core/Primitive';
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
 * Generates a conical shell primitive.
 * This builder does not generate the ring that sits between the cone and the shaft.
 * Used by the ArrowBuilder to construct the arrow head.
 */
export class ConeBuilder extends AxialShapeBuilder {

    /**
     *
     */
    public radialSegments = 1;

    /**
     *
     */
    public thetaSegments = 32;

    public height: Vector3;
    public cutLine: Vector3;
    public clockwise: boolean;

    constructor() {
        super();
        this.height = Vector3.vector(0, 1, 0);
        this.cutLine = Vector3.vector(0, 0, 1);
        this.clockwise = true;
    }

    /**
     *
     */
    public toPrimitive(): Primitive {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        const aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        const aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        const aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL;

        const coneTransform = new ConeTransform(this.clockwise, this.sliceAngle, aPosition, aTangent);
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

        const grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments);

        const iLength = grid.uLength;
        for (let i = 0; i < iLength; i++) {
            const jLength = grid.vLength;
            for (let j = 0; j < jLength; j++) {
                this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength);
            }
        }
        return grid.toPrimitive();
    }
}
