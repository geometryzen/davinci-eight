/**
 *
 */
export var TextureTarget;
(function (TextureTarget) {
    TextureTarget[TextureTarget["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
    TextureTarget[TextureTarget["TEXTURE"] = 5890] = "TEXTURE";
})(TextureTarget || (TextureTarget = {}));
export function checkTextureTarget(name, target) {
    switch (target) {
        case TextureTarget.TEXTURE_2D:
        case TextureTarget.TEXTURE: {
            return;
        }
        default: {
            throw new Error(name + ": target must be one of the enumerated values.");
        }
    }
}
