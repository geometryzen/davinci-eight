"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextureLoader = void 0;
var ImageTexture_1 = require("../core/ImageTexture");
var isFunction_1 = require("../checks/isFunction");
var isDefined_1 = require("../checks/isDefined");
var mustBeString_1 = require("../checks/mustBeString");
var mustBeFunction_1 = require("../checks/mustBeFunction");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var TextureTarget_1 = require("../core/TextureTarget");
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
        mustBeNonNullObject_1.mustBeNonNullObject('contextManager', contextManager);
    }
    /**
     * @param url The Uniform Resource Locator of the image.
     * @param onLoad
     * @param onError
     */
    TextureLoader.prototype.loadImageTexture = function (url, onLoad, onError, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        mustBeString_1.mustBeString('url', url);
        mustBeFunction_1.mustBeFunction('onLoad', onLoad);
        var image = new Image();
        image.onload = function () {
            var texture = new ImageTexture_1.ImageTexture(image, TextureTarget_1.TextureTarget.TEXTURE_2D, _this.contextManager);
            texture.bind();
            texture.upload();
            texture.unbind();
            onLoad(texture);
        };
        image.onerror = function () {
            if (isFunction_1.isFunction(onError)) {
                onError();
            }
        };
        // How to issue a CORS request for an image coming from another domain.
        // The image is fetched from the server without any credentials, i.e., cookies.
        if (isDefined_1.isDefined(options.crossOrigin)) {
            image.crossOrigin = mustBeString_1.mustBeString('crossOrigin', options.crossOrigin);
        }
        image.src = url;
    };
    return TextureLoader;
}());
exports.TextureLoader = TextureLoader;
