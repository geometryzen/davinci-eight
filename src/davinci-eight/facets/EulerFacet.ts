import readOnly from '../i18n/readOnly';
import Facet from '../core/Facet';
import Shareable from '../core/Shareable';
import FacetVisitor from '../core/FacetVisitor';
import R3 from '../math/R3';

/**
 * @class EulerFacet
 */
export default class EulerFacet extends Shareable implements Facet {
    private _rotation: R3;
    /**
     * @class EulerFacet
     * @constructor
     */
    constructor() {
        super('EulerFacet')
        this._rotation = new R3();
    }
    protected destructor(): void {
        super.destructor()
    }
    getProperty(name: string): number[] {
        return void 0
    }
    setProperty(name: string, value: number[]): EulerFacet {
      return this;
    }
    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        console.warn("EulerFacet.setUniforms");
    }
    /**
     * @property rotation
     * @type {R3}
     * @readOnly
     */
    get rotation(): R3 {
        return this._rotation;
    }
    set rotation(unused) {
        throw new Error(readOnly('rotation').message);
    }
}
