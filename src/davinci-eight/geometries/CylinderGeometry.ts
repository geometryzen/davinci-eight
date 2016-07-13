import CylinderBuilder from './CylinderBuilder'
import CylinderGeometryOptions from './CylinderGeometryOptions'
import isDefined from '../checks/isDefined'
import mustBeBoolean from '../checks/mustBeBoolean'
import notSupported from '../i18n/notSupported'
import GeometryContainer from '../core/GeometryContainer'
import GeometryElements from '../core/GeometryElements'
import R3 from '../math/R3'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * A geometry for a Cylinder.
 */
export default class CylinderGeometry extends GeometryContainer {

    /**
     * @property _length
     * @type number
     * @default 1
     * @private
     */
    private _length = 1

    /**
     * @property _radius
     * @type number
     * @default 1
     * @private
     */
    private _radius = 1

    /**
     *
     * @param options
     * @param levelUp
     */
    constructor(options: CylinderGeometryOptions = {}, levelUp = 0) {
        super(options.tilt, options.engine, levelUp + 1);
        this.setLoggingName('CylinderGeometry')

        const builder = new CylinderBuilder(R3.e2, R3.e3, false)

        if (isDefined(options.openBase)) {
            builder.openBase = mustBeBoolean('openBase', options.openBase)
        }
        if (isDefined(options.openCap)) {
            builder.openCap = mustBeBoolean('openCap', options.openCap)
        }
        if (isDefined(options.openWall)) {
            builder.openWall = mustBeBoolean('openWall', options.openWall)
        }

        //        builder.stress.copy(stress)
        if (options.tilt) {
            builder.tilt.copySpinor(options.tilt)
        }
        if (options.offset) {
            builder.offset.copy(options.offset)
        }
        const ps = builder.toPrimitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryElements(vertexArraysFromPrimitive(dataSource), options.tilt, options.engine)
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
     * @type number
     */
    get radius(): number {
        return this._radius
    }
    set radius(radius: number) {
        this._radius = radius
        this.setPrincipalScale('radius', radius)
    }

    /**
     * @property length
     * @type number
     */
    get length(): number {
        return this._length
    }
    set length(length: number) {
        this._length = length
        this.setPrincipalScale('length', length)
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
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

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
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
