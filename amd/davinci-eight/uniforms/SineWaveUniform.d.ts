import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
declare class SineWaveUniform extends Shareable implements IFacet {
    amplitude: number;
    omega: number;
    mean: number;
    uName: string;
    constructor(omega: number, uName?: string);
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = SineWaveUniform;
