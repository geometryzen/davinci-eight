import mustSatisfy = require('../checks/mustSatisfy');
import isString = require('../checks/isString');

function beAString() {
  return "be a string"
}

function mustBeString(name: string, value: string, contextBuilder?: () => string): string {
  mustSatisfy(name, isString(value), beAString, contextBuilder);
  return value;
}

export = mustBeString;
