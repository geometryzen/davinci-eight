import View = require('../cameras/View');
/**
 * @class view
 * @constructor
 */
declare let view: (options?: {
    viewMatrixName?: string;
}) => View;
export = view;
