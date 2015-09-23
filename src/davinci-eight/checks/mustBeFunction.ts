import mustSatisfy = require('../checks/mustSatisfy')
import isFunction = require('../checks/isFunction')

function beFunction() {
  return "be a function"
}

function mustBeFunction(name: string, value: any, contextBuilder?: () => string): any {
  mustSatisfy(name, isFunction(value), beFunction, contextBuilder)
  return value
}

export = mustBeFunction
