import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
import Vector3 = require('../math/Vector3');
/**
 * @class Vector3Uniform
 */
declare class Vector3Uniform extends Shareable implements IFacet {
    private _name;
    private _vector;
    /**
     * @class Vector3Uniform
     * @constructor
     * @param name {string}
     * @param vector {Vector3}
     */
    constructor(name: string, vector: Vector3);
    protected destructor(): void;
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = Vector3Uniform;
