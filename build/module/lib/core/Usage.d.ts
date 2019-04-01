/**
 * WebGLBuffer usage.
 */
export declare enum Usage {
    /**
     * Contents of the buffer are likely to not be used often.
     * Contents are written to the buffer, but not read.
     */
    STREAM_DRAW = 35040,
    /**
     * Contents of the buffer are likely to be used often and not change often.
     * Contents are written to the buffer, but not read.
     */
    STATIC_DRAW = 35044,
    /**
     * Contents of the buffer are likely to be used often and change often.
     * Contents are written to the buffer, but not read.
     */
    DYNAMIC_DRAW = 35048
}
export declare function checkUsage(name: string, usage: Usage): void;
