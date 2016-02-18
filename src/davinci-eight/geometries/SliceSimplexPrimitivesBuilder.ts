import AxialSimplexPrimitivesBuilder from '../geometries/AxialSimplexPrimitivesBuilder';
import VectorE3 from '../math/VectorE3';
import isDefined from '../checks/isDefined';
import mustBeNumber from '../checks/mustBeNumber';
import R3m from '../math/R3m';

function perpendicular(axis: VectorE3) {
    return R3m.random().cross(axis).direction()
}

export default class SliceSimplexPrimitivesBuilder extends AxialSimplexPrimitivesBuilder {

    public sliceAngle: number = 2 * Math.PI;

    public sliceStart: R3m;

    constructor(axis: VectorE3, sliceStart?: VectorE3, sliceAngle: number = 2 * Math.PI) {
        super(axis)
        if (isDefined(sliceStart)) {
            // TODO: Verify that sliceStart is orthogonal to axis.
            this.sliceStart = R3m.copy(sliceStart).direction()
        }
        else {
            this.sliceStart = perpendicular(this.axis)
        }
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle)
    }
}
