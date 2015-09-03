import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');

function frustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array): Float32Array {

  expectArg('left',   left  ).toBeNumber();
  expectArg('right',  right ).toBeNumber();
  expectArg('bottom', bottom).toBeNumber();
  expectArg('top',    top   ).toBeNumber();
  expectArg('near',   near  ).toBeNumber();
  expectArg('far',    far   ).toBeNumber();

  let m = isDefined(matrix) ? matrix : new Float32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

  expectArg('m', m).toSatisfy(m instanceof Float32Array, "elements must be a Float32Array").toSatisfy(m.length === 16, 'elements must have length 16');

  let x = 2 * near / ( right - left );
  let y = 2 * near / ( top - bottom );

  let a = ( right + left ) / ( right - left );
  let b = ( top + bottom ) / ( top - bottom );
  let c = - ( far + near ) / ( far - near );
  let d = - 2 * far * near / ( far - near );

  m[0x0] = x;  m[0x4] = 0;  m[0x8] =  a;  m[0xC] = 0;
  m[0x1] = 0;  m[0x5] = y;  m[0x9] =  b;  m[0xD] = 0;
  m[0x2] = 0;  m[0x6] = 0;  m[0xA] =  c;  m[0xE] = d;
  m[0x3] = 0;  m[0x7] = 0;  m[0xB] = -1;  m[0xF] = 0;

  return m;
}

export = frustumMatrix;
