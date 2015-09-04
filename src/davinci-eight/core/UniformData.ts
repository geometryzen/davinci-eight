import UniformDataVisitor = require('../core/UniformDataVisitor');

interface UniformData {
  accept(visitor: UniformDataVisitor);
}

export = UniformData;
