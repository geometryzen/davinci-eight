import GeometryOptions from './GeometryOptions'

/**
 * @class CylinderGeometryOptions
 * @extends GeometryOptions
 */
interface CylinderGeometryOptions extends GeometryOptions {

    /**
     * @attribute openBase
     * @type boolean
     * @optional
     * @default false
     */
    openBase?: boolean

    /**
     * @attribute openCap
     * @type boolean
     * @optional
     * @default false
     */
    openCap?: boolean

    /**
     * @attribute openWall
     * @type boolean
     * @optional
     * @default false
     */
    openWall?: boolean
}

export default CylinderGeometryOptions
