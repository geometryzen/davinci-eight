import DataUsage = require('../core/DataUsage');

function convertUsage(usage: DataUsage, context: WebGLRenderingContext): number {
  switch(usage) {
    case DataUsage.DYNAMIC_DRAW: {
      return context.DYNAMIC_DRAW;
    }
    case DataUsage.STATIC_DRAW: {
      return context.STATIC_DRAW;
    }
    case DataUsage.STREAM_DRAW: {
      return context.STREAM_DRAW;
    }
    default: {
      throw new Error("Unexpected usage: " + usage);
    }
  }
}

export = convertUsage;