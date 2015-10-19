import mustSatisfy = require('../checks/mustSatisfy')
import isArray = require('../checks/isArray')

function beAnArray() {
  return "be an array"
}

function mustBeArray<T>(name: string, value: T[], contextBuilder?: () => string): T[] {
  mustSatisfy(name, isArray(value), beAnArray, contextBuilder)
  return value
}

export = mustBeArray
