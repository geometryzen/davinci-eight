import CylinderGeometryOptions from './CylinderGeometryOptions';
import cylinderVertexArrays from './cylinderVertexArrays';
import notSupported from '../i18n/notSupported';
import GeometryElements from '../core/GeometryElements';

/**
 * A geometry for a Cylinder.
 */
export default class CylinderGeometry extends GeometryElements {

    private _length = 1;
    private _radius = 1;

    /**
     *
     * @param options
     * @param levelUp
     */
    constructor(options: CylinderGeometryOptions = {}, levelUp = 0) {
        super(cylinderVertexArrays(options), options.tilt, options.engine, levelUp + 1);
        this.setLoggingName('CylinderGeometry')
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    get radius(): number {
        return this._radius
    }
    set radius(radius: number) {
        this._radius = radius
        this.setPrincipalScale('radius', radius)
    }

    get length(): number {
        return this._length
    }
    set length(length: number) {
        this._length = length
        this.setPrincipalScale('length', length)
    }

    getPrincipalScale(name: string): number {
        switch (name) {
            case 'length': {
                return this._length
            }
            case 'radius': {
                return this._radius
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }

    setPrincipalScale(name: string, value: number): void {
        switch (name) {
            case 'length': {
                this._length = value
            }
                break
            case 'radius': {
                this._radius = value
            }
                break
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
        this.setScale(this._radius, this._length, this._radius)
    }
}
