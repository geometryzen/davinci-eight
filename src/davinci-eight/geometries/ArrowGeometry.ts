import ArrowGeometryOptions from './ArrowGeometryOptions';
import arrowPrimitive from './arrowPrimitive';
import ContextManager from '../core/ContextManager';
import GeometryElements from '../core/GeometryElements';
import isDefined from '../checks/isDefined';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import notSupported from '../i18n/notSupported';

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

    /**
     * Equivalent to the radius of the cone after scale factors are applied.
     */
    private _radius: number;

    /**
     * The value that was actually used for the radius of the cone (before scale factors are applied).
     * This becomes a factor in determining the appropriate scale factor orthogonal to the shaft.
     */
    private _radiusCone: number;

    constructor(contextManager: ContextManager, options: ArrowGeometryOptions = { kind: 'ArrowGeometry' }, levelUp = 0) {
        super(mustBeNonNullObject('contextManager', contextManager), arrowPrimitive(options), options, levelUp + 1);
        if (isDefined(options.radiusCone)) {
            this._radiusCone = mustBeNumber("options.radiusCone", options.radiusCone);
        }
        else {
            this._radiusCone = 0.08;
        }
        this._radius = this._radiusCone;
        this.setLoggingName('ArrowGeometry');
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
        return this._radius;
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

    getPrincipalScale(name: 'length' | 'radius'): number {
        switch (name) {
            case 'length': {
                return this._length;
            }
            case 'radius': {
                return this._radius;
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message);
            }
        }
    }

    setPrincipalScale(name: 'length' | 'radius', value: number): void {
        switch (name) {
            case 'length': {
                this._length = value;
                break;
            }
            case 'radius': {
                this._radius = value;
                break;
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message);
            }
        }
        // For the ArrowGeometry, the canonical configuration has the axis of the arrow in the e2 direction.
        // this.scaling.setElement(0, 0, this._radius / this._radiusCone);
        // this.scaling.setElement(1, 1, this._length);
        // this.scaling.setElement(2, 2, this._radius / this._radiusCone);
        // For now we will scale all dimensions equally.
        // This is the easiest way to handle all magnitudes.
        this.scaling.setElement(0, 0, this._length);
        this.scaling.setElement(1, 1, this._length);
        this.scaling.setElement(2, 2, this._length);
    }
}
