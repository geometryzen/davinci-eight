import Cartesian3 = require('../math/Cartesian3');

interface ArrowOptions {
  axis?: Cartesian3;
  flavor?: number;
  coneHeight?: number;
  wireFrame?: boolean;
}

export = ArrowOptions