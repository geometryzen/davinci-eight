/**
 *
 */
export enum TextureTarget {
    TEXTURE_2D = 0x0de1,
    TEXTURE = 0x1702
}

/**
 * @hidden
 */
export function checkTextureTarget(name: string, target: TextureTarget): void {
    switch (target) {
        case TextureTarget.TEXTURE_2D:
        case TextureTarget.TEXTURE: {
            return;
        }
        default: {
            throw new Error(`${name}: target must be one of the enumerated values.`);
        }
    }
}
