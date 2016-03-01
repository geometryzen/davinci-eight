import GeometryOptions from './GeometryOptions'

/**
 * @class TetrahedronGeometryOptions
 */
interface TetrahedronGeometryOptions extends GeometryOptions {
    /**
     * @attribute radius
     * @type number
     * @optional
     * @default 1
     */
    radius?: number;
}

export default TetrahedronGeometryOptions
