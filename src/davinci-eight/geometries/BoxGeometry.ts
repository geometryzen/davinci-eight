import BoxGeometryOptions from './BoxGeometryOptions';
import GeometryElements from '../core/GeometryElements';
import notSupported from '../i18n/notSupported';
import boxPrimitive from './boxPrimitive';

/**
 * A convenience class for creating a BoxGeometry.
 */
export default class BoxGeometry extends GeometryElements {
    private w = 1
    private h = 1
    private d = 1

    /**
     * @param options
     * @param levelUp
     */
    constructor(options: BoxGeometryOptions = {}, levelUp = 0) {
        super(boxPrimitive(options), options.contextManager, options, levelUp + 1)
        this.setLoggingName('BoxGeometry')
        //        if (levelUp === 0) {
        //            this.synchUp();
        //        }
    }

    protected destructor(levelUp: number): void {
        //        if (levelUp === 0) {
        //            this.cleanUp();
        //        }
        super.destructor(levelUp + 1);
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number {
        switch (name) {
            case 'width': {
                return this.w
            }
            case 'height': {
                return this.h
            }
            case 'depth': {
                return this.d
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
    setPrincipalScale(name: string, value: number): void {
        switch (name) {
            case 'width': {
                this.w = value
            }
                break
            case 'height': {
                this.h = value
            }
                break
            case 'depth': {
                this.d = value
            }
                break
            default: {
                throw new Error(notSupported(`setPrincipalScale('${name}')`).message)
            }
        }
        this.setScale(this.w, this.h, this.d)
    }
}
