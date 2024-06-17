/**
 * WebGLBuffer usage.
 */
export enum Usage {
    /**
     * Contents of the buffer are likely to not be used often.
     * Contents are written to the buffer, but not read.
     */
    STREAM_DRAW = 0x88e0,
    /**
     * Contents of the buffer are likely to be used often and not change often.
     * Contents are written to the buffer, but not read.
     */
    STATIC_DRAW = 0x88e4,
    /**
     * Contents of the buffer are likely to be used often and change often.
     * Contents are written to the buffer, but not read.
     */
    DYNAMIC_DRAW = 0x88e8
}

/**
 * @hidden
 */
export function checkUsage(name: string, usage: Usage): void {
    switch (usage) {
        case Usage.STREAM_DRAW:
        case Usage.STATIC_DRAW:
        case Usage.DYNAMIC_DRAW: {
            return;
        }
        default: {
            throw new Error(`${name}: Usage must be one of the enumerated values.`);
        }
    }
}
