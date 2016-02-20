import vertexArraysFromPrimitive from './vertexArraysFromPrimitive'
import GeometryElements from './GeometryElements'
import Primitive from './Primitive'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class GeometryPrimitive
 * @extends GeometryElements
 */
export default class GeometryPrimitive extends GeometryElements {

    /**
     * @class GeometryPrimitive
     * @constructor
     * @param dataSource {Primitive}
     */
    constructor(dataSource: Primitive) {
        super(vertexArraysFromPrimitive(dataSource))
    }
}
