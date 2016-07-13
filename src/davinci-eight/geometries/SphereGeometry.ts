import GeometryContainer from '../core/GeometryContainer'
import GeometryElements from '../core/GeometryElements'
import notSupported from '../i18n/notSupported'
import SphereBuilder from './SphereBuilder'
import SphereGeometryOptions from './SphereGeometryOptions'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'


/**
 * A convenience class for creating a sphere.
 */
export default class SphereGeometry extends GeometryContainer {

    /**
     * @default 1
     */
    private _radius = 1

    /**
     * @param options
     * @param levelUp
     */
    constructor(options: SphereGeometryOptions = {}, levelUp = 0) {
        super(options.tilt, options.engine, levelUp + 1)
        this.setLoggingName('SphereGeometry')
        const builder = new SphereBuilder()
        const ps = builder.toPrimitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const p = ps[i]
            const geometry = new GeometryElements(vertexArraysFromPrimitive(p), options.tilt, options.engine)
            this.addPart(geometry)
            geometry.release()
        }
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

    /**
     * @property radius
     * @type {number}
     */
    get radius(): number {
        return this._radius
    }
    set radius(radius: number) {
        this._radius = radius
        this.setPrincipalScale('radius', radius)
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number {
        switch (name) {
            case 'radius': {
                return this._radius
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
            case 'radius': {
                this._radius = value
            }
                break
            default: {
                throw new Error(notSupported(`setPrincipalScale('${name}')`).message)
            }
        }
        this.setScale(this._radius, this._radius, this._radius)
    }
}
