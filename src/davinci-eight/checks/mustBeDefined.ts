import mustSatisfy = require('../checks/mustSatisfy');
import isDefined = require('../checks/isDefined');

function beDefined() {
  return "be defined"
}

function mustBeDefined(name: string, value: any, contextBuilder?: () => string): any {
  mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
  return value;
}

export = mustBeDefined;
