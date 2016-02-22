import R3 from '../math/R3';
import PrimitivesBuilder from '../geometries/PrimitivesBuilder';
import IAxialGeometry from '../geometries/IAxialGeometry';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

export default class AxialPrimitivesBuilder extends PrimitivesBuilder implements IAxialGeometry<AxialPrimitivesBuilder> {
    protected _axis: R3;
    private _sliceAngle: number = 2 * Math.PI;
    private _sliceStart: R3;
    constructor(axis: VectorE3, sliceStart?: VectorE3) {
        super()
        this.setAxis(axis)
        if (sliceStart) {
            this.setSliceStart(sliceStart)
        }
        else {
            this.setSliceStart(Vector3.random().cross(axis))
        }
    }
    get axis(): R3 {
        return this._axis
    }
    set axis(axis: R3) {
        this.setAxis(axis)
    }
    setAxis(axis: VectorE3): AxialPrimitivesBuilder {
        mustBeObject('axis', axis)
        this._axis = R3.direction(axis)
        this.setSliceStart(Vector3.random().cross(this._axis))
        return this
    }
    get sliceAngle(): number {
        return this._sliceAngle;
    }
    set sliceAngle(sliceAngle: number) {
        mustBeNumber('sliceAngle', sliceAngle)
        this._sliceAngle = sliceAngle;
    }
    get sliceStart(): R3 {
        return this._sliceStart
    }
    set sliceStart(sliceStart: R3) {
        this.setSliceStart(sliceStart)
    }
    setPosition(position: VectorE3): AxialPrimitivesBuilder {
        super.setPosition(position)
        return this
    }
    setSliceStart(sliceStart: VectorE3) {
        mustBeObject('sliceStart', sliceStart)
        this._sliceStart = R3.direction(sliceStart)
    }
    enableTextureCoords(enable: boolean): AxialPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}