import ArrayBuffer = require('../core/ArrayBuffer');
interface AttribDataInfo {
    /**
     *
     */
    buffer: ArrayBuffer;
    /**
     * The number of components per vertex attribute.
     */
    size: number;
    /**
     *
     */
    normalized?: boolean;
    /**
     *
     */
    stride?: number;
    /**
     *
     */
    offset?: number;
}
export = AttribDataInfo;
