import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');

class StockTicker implements UniformData {
  public price: number;
  constructor() {
    this.price = Math.PI;
  }
  accept(visitor: UniformDataVisitor): void {
    visitor.uniform1f('uStockTicker', this.price);
  }
}

export = StockTicker;