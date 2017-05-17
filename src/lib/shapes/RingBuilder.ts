import { Approximation } from '../transforms/Approximation';
import { Direction } from '../transforms/Direction';
import { Duality } from '../transforms/Duality';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { AxialShapeBuilder } from './AxialShapeBuilder';
import { Primitive } from '../core/Primitive';
import { RingTransform } from '../transforms/RingTransform';
import { Rotation } from '../transforms/Rotation';
import { Scaling } from '../transforms/Scaling';
import { Translation } from '../transforms/Translation';
import { CoordsTransform2D } from '../transforms/CoordsTransform2D';
import { Vector3 } from '../math/Vector3';

/**
 * Constructs a one-sided ring using a TRIANGLE_STRIP.
 */
export class RingBuilder extends AxialShapeBuilder {

    /**
     * The radius of the hole in the ring.
     */
    public innerRadius = 0;

    /**
     * The radius of the outer edge of the ring.
     */
    public outerRadius = 1;

    /**
     * The number of segments in the radial direction.
     */
    public radialSegments = 1;

    /**
     * The number of segments in the angular direction.
     */
    public thetaSegments = 32;

    /**
     * The direction of the normal vector perpendicular to the plane of the ring.
     */
    public e: Vector3 = Vector3.vector(0, 1, 0);

    /**
     * The direction from which a slice is created.
     */
    public cutLine: Vector3 = Vector3.vector(0, 0, 1);

    /**
     * The orientation of the slice relative to the cutLine.
     */
    public clockwise = true;

    /**
     *
     */
    toPrimitive(): Primitive {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        const aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        const aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        const aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL;

        this.transforms.push(new RingTransform(this.e, this.cutLine, this.clockwise, this.outerRadius, this.innerRadius, this.sliceAngle, aPosition, aTangent));

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
