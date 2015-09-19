import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
declare class StockTicker implements UniformData {
    price: number;
    constructor();
    accept(visitor: UniformDataVisitor): void;
}
export = StockTicker;
