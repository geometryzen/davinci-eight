import isDefined = require('../checks/isDefined')
import isInteger = require('../checks/isInteger')
import mustBeDefined = require('../checks/mustBeDefined')
import mustSatisfy = require('../checks/mustSatisfy')

function haveOwnProperty(prop: string) {
  return function() {
    return "have own property `" + prop + "`"
  }
}

function mustHaveOwnProperty(name: string, value: {}, prop: string, contextBuilder?: () => string): void {
  mustBeDefined('name', name)
  mustBeDefined('prop', prop)
  if (isDefined(value)) {
    if (!value.hasOwnProperty(prop)) {
      mustSatisfy(name, false, haveOwnProperty(prop), contextBuilder)
    }
  }
  else {
    mustBeDefined(name, value, contextBuilder)
  }
}

export = mustHaveOwnProperty;
