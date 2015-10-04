import mustBeNumber = require('../checks/mustBeNumber')

function clamp(x: number, min: number, max: number) {
  mustBeNumber('x', x);
  mustBeNumber('min', min);
  mustBeNumber('max', max);
  return (x < min) ? min : ( ( x > max ) ? max : x );
}

export = clamp;
