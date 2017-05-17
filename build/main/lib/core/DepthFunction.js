"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An enumeration specifying the depth comparison function, which sets the conditions
 * under which the pixel will be drawn. The default value is LESS.
 */
var DepthFunction;
(function (DepthFunction) {
    /**
     * never pass
     */
    DepthFunction[DepthFunction["NEVER"] = 512] = "NEVER";
    /**
     * pass if the incoming value is less than the depth buffer value
     */
    DepthFunction[DepthFunction["LESS"] = 513] = "LESS";
    /**
     * pass if the incoming value equals the the depth buffer value
     */
    DepthFunction[DepthFunction["EQUAL"] = 514] = "EQUAL";
    /**
     * pass if the incoming value is less than or equal to the depth buffer value
     */
    DepthFunction[DepthFunction["LEQUAL"] = 515] = "LEQUAL";
    /**
     * pass if the incoming value is greater than the depth buffer value
     */
    DepthFunction[DepthFunction["GREATER"] = 516] = "GREATER";
    /**
     * pass if the incoming value is not equal to the depth buffer value
     */
    DepthFunction[DepthFunction["NOTEQUAL"] = 517] = "NOTEQUAL";
    /**
     * pass if the incoming value is greater than or equal to the depth buffer value
     */
    DepthFunction[DepthFunction["GEQUAL"] = 518] = "GEQUAL";
    /**
     * always pass
     */
    DepthFunction[DepthFunction["ALWAYS"] = 519] = "ALWAYS";
})(DepthFunction = exports.DepthFunction || (exports.DepthFunction = {}));
