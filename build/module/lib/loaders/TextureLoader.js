import { ImageTexture } from '../core/ImageTexture';
import { isFunction } from '../checks/isFunction';
import { isDefined } from '../checks/isDefined';
import { mustBeString } from '../checks/mustBeString';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { TextureTarget } from '../core/TextureTarget';
/**
 * A utility for loading Texture resources from a URL.
 *
 *     const loader = new EIGHT.TextureLoader(engine)
 *     loader.loadImageTexture('img/textures/solar-system/2k_earth_daymap.jpg', function(texture) {
 *       texture.minFilter = EIGHT.TextureMinFilter.NEAREST;
 *       const geometry = new EIGHT.SphereGeometry(engine, {azimuthSegments: 64, elevationSegments: 32})
 *       const material = new EIGHT.HTMLScriptsMaterial(engine, ['vs', 'fs'])
 *       sphere = new EIGHT.Mesh(geometry, material, engine)
 *       geometry.release()
 *       material.release()
 *       sphere.texture = texture
 *       texture.release()
 *       scene.add(sphere)
 *     })
 */
var TextureLoader = /** @class */ (function () {
    /**
     * @param contextManager
     */
    function TextureLoader(contextManager) {
        this.contextManager = contextManager;
        mustBeNonNullObject('contextManager', contextManager);
    }
    /**
     *
     * @param url The Uniform Resource Locator of the image.
     * @param options
     */
    TextureLoader.prototype.imageTexture = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        mustBeString('url', url);
        if (isDefined(options.crossOrigin)) {
            mustBeString('options.crossOrigin', options.crossOrigin);
        }
        return new Promise(function (response, reject) {
            var image = new Image();
            image.onload = function () {
                var texture = new ImageTexture(image, TextureTarget.TEXTURE_2D, _this.contextManager);
                texture.bind();
                texture.upload();
                texture.unbind();
                response(texture);
            };
            image.onerror = function (event, source, lineno, colno, cause) {
                reject(new Error("Error occurred while loading image. Cause: " + cause));
            };
            // How to issue a CORS request for an image coming from another domain.
            // The image is fetched from the server without any credentials, i.e., cookies.
            if (isDefined(options.crossOrigin)) {
                image.crossOrigin = options.crossOrigin;
            }
            image.src = url;
        });
    };
    /**
     * @deprecated
     * @param url The Uniform Resource Locator of the image.
     * @param onLoad
     * @param onError
     * @param options
     */
    TextureLoader.prototype.loadImageTexture = function (url, onLoad, onError, options) {
        if (options === void 0) { options = {}; }
        console.warn("loadImageTexture() is deprecated. Please use imageTexture().");
        mustBeFunction('onLoad', onLoad);
        if (isDefined(onError)) {
            mustBeFunction('onError', onError);
        }
        this.imageTexture(url, options)
            .then(function (texture) {
            onLoad(texture);
        })
            .catch(function (err) {
            if (isFunction(onError)) {
                onError();
            }
        });
    };
    return TextureLoader;
}());
export { TextureLoader };
