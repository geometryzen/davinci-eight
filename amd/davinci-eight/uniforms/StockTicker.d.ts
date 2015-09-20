import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
declare class StockTicker implements UniformData {
    price: number;
    constructor();
    setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}
export = StockTicker;
