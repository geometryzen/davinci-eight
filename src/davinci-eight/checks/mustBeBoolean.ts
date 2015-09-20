import mustSatisfy = require('../checks/mustSatisfy');
import isBoolean = require('../checks/isBoolean');

function beBoolean() {
  return "be boolean"
}

function mustBeBoolean(name: string, value: boolean, contextBuilder?: () => string): boolean {
  mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
  return value;
}

export = mustBeBoolean;
