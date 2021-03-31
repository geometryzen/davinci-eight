/**
 * An enumeration specifying the depth comparison function, which sets the conditions
 * under which the pixel will be drawn. The default value is LESS.
 */
export enum DepthFunction {

    /**
     * never pass
     */
    NEVER = 0x0200,

    /**
     * pass if the incoming value is less than the depth buffer value
     */
    LESS = 0x0201,

    /**
     * pass if the incoming value equals the the depth buffer value
     */
    EQUAL = 0x0202,

    /**
     * pass if the incoming value is less than or equal to the depth buffer value
     */
    LEQUAL = 0x0203,

    /**
     * pass if the incoming value is greater than the depth buffer value
     */
    GREATER = 0x0204,

    /**
     * pass if the incoming value is not equal to the depth buffer value
     */
    NOTEQUAL = 0x0205,

    /**
     * pass if the incoming value is greater than or equal to the depth buffer value
     */
    GEQUAL = 0x0206,

    /**
     * always pass
     */
    ALWAYS = 0x0207
}
