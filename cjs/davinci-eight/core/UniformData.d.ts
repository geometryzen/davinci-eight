import UniformDataVisitor = require('../core/UniformDataVisitor');
interface UniformData {
    accept(visitor: UniformDataVisitor): any;
}
export = UniformData;
