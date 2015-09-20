import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');

class StockTicker implements UniformData {
  public price: number;
  constructor() {
    this.price = Math.PI;
  }
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void {
    visitor.uniform1f('uStockTicker', this.price, canvasId);
  }
}

export = StockTicker;