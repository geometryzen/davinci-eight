import mustSatisfy = require('../checks/mustSatisfy');
import isInteger = require('../checks/isInteger');

function beCanvasId() {
  return "be a `number` which is also an integer"
}

function mustBeCanvasId(name: string, value: number, contextBuilder?: () => string): number {
  mustSatisfy(name, isInteger(value), beCanvasId, contextBuilder);
  return value;
}

export = mustBeCanvasId;
