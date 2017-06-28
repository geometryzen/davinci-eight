/**
 * WebGLBuffer usage.
 */
export var Usage;
(function (Usage) {
    /**
     * Contents of the buffer are likely to not be used often.
     * Contents are written to the buffer, but not read.
     */
    Usage[Usage["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
    /**
     * Contents of the buffer are likely to be used often and not change often.
     * Contents are written to the buffer, but not read.
     */
    Usage[Usage["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
    /**
     * Contents of the buffer are likely to be used often and change often.
     * Contents are written to the buffer, but not read.
     */
    Usage[Usage["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
})(Usage || (Usage = {}));
export function checkUsage(name, usage) {
    switch (usage) {
        case Usage.STREAM_DRAW:
        case Usage.STATIC_DRAW:
        case Usage.DYNAMIC_DRAW: {
            return;
        }
        default: {
            throw new Error(name + ": Usage must be one of the enumerated values.");
        }
    }
}
