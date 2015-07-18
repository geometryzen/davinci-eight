import VertexUniformProvider = require('../core/VertexUniformProvider');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class View
 */
interface View extends VertexUniformProvider {
    /**
     * @property eye
     * @type Cartesian3
     */
    eye: Cartesian3;
    /**
     * @property look
     * @type Cartesian3
     */
    look: Cartesian3;
    /**
     * @property look
     * @type Cartesian3
     */
    up: Cartesian3;
}
export = View;
