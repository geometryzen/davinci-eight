import Approximation from './transforms/Approximation'
import Direction from './transforms/Direction'
import Duality from './transforms/Duality'
import GeometryBuilder from './GeometryBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import TriangleStrip from './TriangleStrip';
import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import Primitive from '../core/Primitive';
import RingTransform from './transforms/RingTransform'
import Rotation from './transforms/Rotation'
import Scaling from './transforms/Scaling'
import Translation from './transforms/Translation'
import TextureCoords from './transforms/TextureCoords'

const aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION
const aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT
const aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL

/**
 * Constructs a one-sided ring using a TRIANGLE_STRIP.
 *
 * @class RingBuilder
 * @extends AxialPrimitivesBuilder
 */
export default class RingBuilder extends AxialPrimitivesBuilder implements GeometryBuilder {

    /**
     * @property innerRadius
     * @type number
     * @default 0
     */
    public innerRadius: number = 0;

    /**
     * @property outerRadius
     * @type number
     * @default 1
     */
    public outerRadius: number = 1;

    /**
     * @property radialSegments
     * @type number
     * @default 1
     */
    public radialSegments = 1;

    /**
     * @property thetaSegments
     * @type number
     * @default 32
     */
    public thetaSegments = 32;

    /**
     * @class RingBuilder
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @method toPrimitives
     * @type Primitive[]
     */
    toPrimitives(): Primitive[] {

        this.transforms.push(new RingTransform(this.up, this.outerRadius, this.innerRadius, this.out, this.sliceAngle, aPosition, aTangent))

        this.transforms.push(new Scaling(this.stress, [aPosition, aTangent]))
        this.transforms.push(new Rotation(this.tilt, [aPosition, aTangent]))
        this.transforms.push(new Translation(this.offset, [aPosition]))

        // Use a duality transformation with a sign change to convert the tangent planes to vectors.
        this.transforms.push(new Duality(aTangent, aNormal, true, true))
        // Normalize the normal vectors.
        this.transforms.push(new Direction(aNormal))
        // Discard insignificant coordinates.
        this.transforms.push(new Approximation(9, [aPosition, aNormal]))

        if (this.useTextureCoord) {
            this.transforms.push(new TextureCoords(false, false, false))
        }

        const grid = new TriangleStrip(this.thetaSegments, this.radialSegments)

        const iLength = grid.uLength
        for (let i = 0; i < iLength; i++) {
            const jLength = grid.vLength
            for (let j = 0; j < jLength; j++) {
                this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength)
            }
        }
        return [grid.toPrimitive()]
    }
}
