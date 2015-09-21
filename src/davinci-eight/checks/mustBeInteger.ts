import mustSatisfy = require('../checks/mustSatisfy')
import isInteger = require('../checks/isInteger')

function beAnInteger() {
  return "be an integer"
}

function mustBeInteger(name: string, value: number, contextBuilder?: () => string): number {
  mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder)
  return value
}

export = mustBeInteger
