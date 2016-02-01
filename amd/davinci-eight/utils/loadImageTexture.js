define(["require", "exports"], function (require, exports) {
    var g_loadingImages = [];
    function clearLoadingImages() {
        for (var ii = 0; ii < g_loadingImages.length; ++ii) {
            g_loadingImages[ii].onload = undefined;
        }
        g_loadingImages = [];
    }
    function doLoadImageTexture(ctx, image, texture) {
        g_loadingImages.splice(g_loadingImages.indexOf(image), 1);
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
    }
    function loadImageTexture(ctx, url) {
        var texture = ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        var image = new Image();
        g_loadingImages.push(image);
        image.onload = function () { doLoadImageTexture(ctx, image, texture); };
        image.src = url;
        return texture;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = loadImageTexture;
});
