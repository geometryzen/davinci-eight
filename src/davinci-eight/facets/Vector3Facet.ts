import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';
import mustBeString from '../checks/mustBeString';
import Vector3 from '../math/Vector3';

/**
 * Updates a <code>uniform vec3</code> shader parameter from a <code>Vector3</code>.
 */
export default class Vector3Facet implements Facet {

    public vector = Vector3.vector(0, 0, 0);

    constructor(public name: string) {
        mustBeString('name', name);
    }

    setUniforms(visitor: FacetVisitor): void {
        const v = this.vector
        visitor.uniform3f(this.name, v.x, v.y, v.z)
    }
}
