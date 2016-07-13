import Approximation from '../transforms/Approximation'
import Direction from '../transforms/Direction'
import Duality from '../transforms/Duality'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTriangleStrip from '../atoms/GridTriangleStrip';
import AxialShapeBuilder from './AxialShapeBuilder';
import Primitive from '../core/Primitive';
import ConeTransform from '../transforms/ConeTransform'
import Rotation from '../transforms/Rotation'
import R3 from '../math/R3'
import Scaling from '../transforms/Scaling'
import Translation from '../transforms/Translation'
import CoordsTransform2D from '../transforms/CoordsTransform2D'
import VectorE3 from '../math/VectorE3'

const aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION
const aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT
const aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL

/**
 *
 */
export default class ConicalShellBuilder extends AxialShapeBuilder {

    /**
     *
     */
    public radialSegments = 1

    /**
     *
     */
    public thetaSegments = 32

    private e: R3
    private cutLine: R3
    private clockwise: boolean

    /**
     *
     * @param e
     * @param cutLine
     * @param clockwise
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean) {
        super()
        this.e = R3.direction(e)
        this.cutLine = R3.direction(cutLine)
        this.clockwise = clockwise
    }

    get radius(): number {
        return this.stress.x
    }
    set radius(radius: number) {
        this.stress.x = radius
        this.stress.z = radius
    }

    get height() {
        return this.stress.y
    }
    set height(height: number) {
        this.stress.y = height
    }

    /**
     *
     */
    public toPrimitive(): Primitive {
        this.transforms.push(new ConeTransform(this.e, this.cutLine, this.clockwise, this.sliceAngle, aPosition, aTangent))

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
            this.transforms.push(new CoordsTransform2D(false, false, false))
        }

        const grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments)

        const iLength = grid.uLength
        for (let i = 0; i < iLength; i++) {
            const jLength = grid.vLength
            for (let j = 0; j < jLength; j++) {
                this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength)
            }
        }
        return grid.toPrimitive()
    }
}
