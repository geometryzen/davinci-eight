import GeometryElements from '../core/GeometryElements';
import notSupported from '../i18n/notSupported';
import SphereGeometryOptions from './SphereGeometryOptions';
import spherePrimitive from './spherePrimitive';


/**
 * A convenience class for creating a sphere.
 */
export default class SphereGeometry extends GeometryElements {

    /**
     * @default 1
     */
    private _radius = 1;

    /**
     * @param options
     * @param levelUp
     */
    constructor(options: SphereGeometryOptions = {}, levelUp = 0) {
        super(spherePrimitive(options), options.engine, options, levelUp + 1);
        this.setLoggingName('SphereGeometry')
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
        this._radius = radius;
        this.setPrincipalScale('radius', radius);
    }

    getPrincipalScale(name: string): number {
        switch (name) {
            case 'radius': {
                return this._radius;
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message);
            }
        }
    }

    setPrincipalScale(name: string, value: number): void {
        switch (name) {
            case 'radius': {
                this._radius = value;
            }
                break
            default: {
                throw new Error(notSupported(`setPrincipalScale('${name}')`).message);
            }
        }
        this.setScale(this._radius, this._radius, this._radius);
    }
}
