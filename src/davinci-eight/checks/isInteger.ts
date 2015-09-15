import isNumber = require('../checks/isNumber');

function isInteger(x: number): boolean {
  // % coerces its operand to numbers so a type-check first is required.
  // Not ethat ECMAScript 6 provides Number.isInteger().
  return isNumber(x) && x % 1 === 0;
}

export = isInteger;