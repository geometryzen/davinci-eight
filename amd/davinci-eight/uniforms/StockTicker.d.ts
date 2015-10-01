import IFacet = require('../core/IFacet');
import Shareable = require('../utils/Shareable');
import IFacetVisitor = require('../core/IFacetVisitor');
declare class StockTicker extends Shareable implements IFacet {
    price: number;
    constructor();
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = StockTicker;
