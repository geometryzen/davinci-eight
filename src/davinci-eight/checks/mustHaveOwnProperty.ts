import mustSatisfy = require('../checks/mustSatisfy');
import isInteger = require('../checks/isInteger');

function makeBuilder(prop: string) {
  return function() {
    return "have own property " + prop;
  }
}

function mustHaveOwnProperty(name: string, value: {}, prop: string, contextBuilder: () => string): void {
  if (!value.hasOwnProperty(prop)) {
    mustSatisfy(name, false, makeBuilder(prop), contextBuilder);
  }
}

export = mustHaveOwnProperty;
