import IFacet = require('../core/IFacet')
import Shareable = require('../utils/Shareable')
import IFacetVisitor = require('../core/IFacetVisitor')

class StockTicker extends Shareable implements IFacet {
  public price: number;
  constructor() {
    super('StockTicker')
    this.price = Math.PI
  }
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    visitor.uniform1f('uStockTicker', this.price, canvasId);
  }
}

export = StockTicker;