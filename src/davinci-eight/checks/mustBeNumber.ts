import mustSatisfy = require('../checks/mustSatisfy');
import isNumber = require('../checks/isNumber');

function beANumber() {
  return "be a number"
}

function mustBeInteger(name: string, value: number, contextBuilder: () => string): number {
  mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
  return value;
}

export = mustBeInteger;
