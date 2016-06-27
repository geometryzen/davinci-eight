/**
 * WebGLBuffer usage.
 */
enum Usage {
    STATIC_DRAW,
    DYNAMIC_DRAW
}

export function checkUsage(name: string, usage: Usage): void {
    switch (usage) {
        case Usage.STATIC_DRAW:
        case Usage.DYNAMIC_DRAW: {
            return;
        }
        default: {
            throw new Error(`${name}: Usage must be one of the enumerated values.`);
        }
    }
}

export default Usage;
