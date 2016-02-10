import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import R3 from '../math/R3';

/**
 * @module EIGHT
 * @submodule facets
 */

var LOGGING_NAME = 'Vector3Facet'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class Vector3Facet
 */
export default class Vector3Facet implements Facet {
    private _name: string;
    private _vector: R3;
    /**
     * @class Vector3Facet
     * @constructor
     * @param name {string}
     * @param vector {R3}
     */
    constructor(name: string, vector: R3) {
        this._name = mustBeString('name', name, contextBuilder)
        this._vector = mustBeObject('vector', vector, contextBuilder)
    }

    getProperty(name: string): number[] {
        return void 0;
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {Vector3Facet}
     * @chainable
     */
    setProperty(name: string, value: number[]): Vector3Facet {
        return this;
    }


    setUniforms(visitor: FacetVisitor): void {
        visitor.vec3(this._name, this._vector)
    }
}
