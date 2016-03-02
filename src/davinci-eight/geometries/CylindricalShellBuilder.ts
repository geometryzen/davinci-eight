import Approximation from './transforms/Approximation'
import Direction from './transforms/Direction'
import Duality from './transforms/Duality'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import GridTriangleStrip from './primitives/GridTriangleStrip';
import AxialPrimitivesBuilder from './AxialPrimitivesBuilder';
import Primitive from '../core/Primitive';
import CylinderTransform from './transforms/CylinderTransform'
import Rotation from './transforms/Rotation'
import Scaling from './transforms/Scaling'
import Translation from './transforms/Translation'
import TextureCoords from './transforms/TextureCoords'
import VectorE3 from '../math/VectorE3'
import Vector3 from '../math/Vector3'

const aPosition = GraphicsProgramSymbols.ATTRIBUTE_POSITION
const aTangent = GraphicsProgramSymbols.ATTRIBUTE_TANGENT
const aNormal = GraphicsProgramSymbols.ATTRIBUTE_NORMAL

/**
 * This implementation only builds the walls of the cylinder (by wrapping a grid)
 *
 * @class CylindricalShellBuilder
 * @extends AxialPrimitivesBuilder
 */
export default class CylindricalShellBuilder extends AxialPrimitivesBuilder {

    /**
     * @property radialSegments
     * @type number
     * @default 1
     */
    public radialSegments = 1

    /**
     * @property thetaSegments
     * @type number
     * @default 32
     */
    public thetaSegments = 32

    private e: Vector3
    private cutLine: Vector3
    private clockwise: boolean

    /**
     * @class CylindricalShellBuilder
     * @constructor
     * @param e {VectorE3}
     * @param cutLine {VectorE3}
     * @param clockwise {boolean}
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean) {
        super()
        this.e = Vector3.copy(e)
        this.cutLine = Vector3.copy(cutLine)
        this.clockwise = clockwise
    }

    /**
     * @property radius
     * @type number
     * @default 1
     */
    get radius() {
        return this.stress.x
    }
    set radius(radius: number) {
        this.stress.x = radius
        this.stress.z = radius
    }

    /**
     * @property height
     * @type number
     * @default 1
     */
    get height() {
        return this.stress.y
    }
    set height(height: number) {
        this.stress.y = height
    }

    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[] {
        this.transforms.push(new CylinderTransform(this.e, this.cutLine, this.clockwise, this.sliceAngle, aPosition, aTangent))

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

        const grid = new GridTriangleStrip(this.thetaSegments, this.radialSegments)

        const iLength = grid.uLength
        for (let i = 0; i < iLength; i++) {
            const jLength = grid.vLength
            for (let j = 0; j < jLength; j++) {
                this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength)
            }
        }

        const primitive = grid.toPrimitive()
        return [primitive]
    }
}
