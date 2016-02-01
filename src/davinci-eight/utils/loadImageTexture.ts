
// Array of images curently loading
var g_loadingImages: HTMLImageElement[] = [];

// Clears all the images currently loading.
// This is used to handle context lost events.
function clearLoadingImages() {
    for (var ii = 0; ii < g_loadingImages.length; ++ii) {
        g_loadingImages[ii].onload = undefined;
    }
    g_loadingImages = [];
}

function doLoadImageTexture(ctx: WebGLRenderingContext, image: HTMLImageElement, texture: WebGLTexture) {
    g_loadingImages.splice(g_loadingImages.indexOf(image), 1);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    // FIXME ditto ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    //ctx.generateMipmap(ctx.TEXTURE_2D)
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}

//
// loadImageTexture
//
// Load the image at the passed url, place it in a new WebGLTexture object and return the WebGLTexture.
//
export default function loadImageTexture(ctx: WebGLRenderingContext, url: string) {
    var texture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    // FIXME TypeScript ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 1, 1, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
    var image: HTMLImageElement = new Image();
    g_loadingImages.push(image);
    image.onload = function() { doLoadImageTexture(ctx, image, texture) }
    image.src = url;
    return texture;
}
