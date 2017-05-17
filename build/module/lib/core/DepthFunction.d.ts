/**
 * An enumeration specifying the depth comparison function, which sets the conditions
 * under which the pixel will be drawn. The default value is LESS.
 */
export declare enum DepthFunction {
    /**
     * never pass
     */
    NEVER = 512,
    /**
     * pass if the incoming value is less than the depth buffer value
     */
    LESS = 513,
    /**
     * pass if the incoming value equals the the depth buffer value
     */
    EQUAL = 514,
    /**
     * pass if the incoming value is less than or equal to the depth buffer value
     */
    LEQUAL = 515,
    /**
     * pass if the incoming value is greater than the depth buffer value
     */
    GREATER = 516,
    /**
     * pass if the incoming value is not equal to the depth buffer value
     */
    NOTEQUAL = 517,
    /**
     * pass if the incoming value is greater than or equal to the depth buffer value
     */
    GEQUAL = 518,
    /**
     * always pass
     */
    ALWAYS = 519,
}
