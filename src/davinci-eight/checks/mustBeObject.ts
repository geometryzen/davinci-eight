import mustSatisfy = require('../checks/mustSatisfy');
import isObject = require('../checks/isObject');

function beObject() {
  return "be an `object`";
}

function mustBeObject<T>(name: string, value: T, contextBuilder?: () => string): T {
  mustSatisfy(name, isObject(value), beObject, contextBuilder);
  return value;
}

export = mustBeObject;
