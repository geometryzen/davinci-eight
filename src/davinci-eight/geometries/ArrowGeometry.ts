import ArrowGeometryOptions from './ArrowGeometryOptions';
import arrowVertexArrays from './arrowVertexArrays';
import GeometryElements from '../core/GeometryElements';
import notSupported from '../i18n/notSupported'

/**
 * <p>
 * A convenience class for creating an arrow.
 * </p>
 * <p>
 * The initial axis unit vector defaults to <b>e<b><sub>2</sub>
 * </p>
 * <p>
 * The cutLine unit vector defaults to <b>e<b><sub>3</sub>
 * </p>
 */
export default class ArrowGeometry extends GeometryElements {

    private _length = 1.0;

    private _radius = 0.08;

    constructor(options: ArrowGeometryOptions = {}, levelUp = 0) {
        super(arrowVertexArrays(options), options.tilt, options.engine, levelUp + 1);
        this.setLoggingName('ArrowGeometry');
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }

    get radius(): number {
        return this._radius
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius);
    }

    get length(): number {
        return this._length;
    }
    set length(length: number) {
        this._length = length;
        this.setPrincipalScale('length', length);
    }

    getPrincipalScale(name: string): number {
        switch (name) {
            case 'length': {
                return this._length;
            }
            case 'radius': {
                return this._radius;
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
        this.scaling.setElement(0, 0, this._radius);
        this.scaling.setElement(1, 1, this._length);
        this.scaling.setElement(2, 2, this._radius);
    }
}
