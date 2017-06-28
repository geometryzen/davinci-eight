import { ContextManager } from '../core/ContextManager';
import { ImageTexture } from '../core/ImageTexture';
import { isFunction } from '../checks/isFunction';
import { isDefined } from '../checks/isDefined';
import { mustBeString } from '../checks/mustBeString';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { TextureLoaderOptions } from './TextureLoaderOptions';
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
export class TextureLoader {
    /**
     * @param contextManager
     */
    constructor(private contextManager: ContextManager) {
        mustBeNonNullObject('contextManager', contextManager);
    }

    /**
     * @param url The Uniform Resource Locator of the image.
     * @param onLoad
     * @param onError
     */
    loadImageTexture(url: string, onLoad: (texture: ImageTexture) => any, onError?: () => any, options: TextureLoaderOptions = {}): void {
        mustBeString('url', url);
        mustBeFunction('onLoad', onLoad);
        const image = new Image();
        image.onload = () => {
            const texture = new ImageTexture(image, TextureTarget.TEXTURE_2D, this.contextManager);
            texture.bind();
            texture.upload();
            texture.unbind();
            onLoad(texture);
        };
        image.onerror = () => {
            if (isFunction(onError)) {
                onError();
            }
        };
        // How to issue a CORS request for an image coming from another domain.
        // The image is fetched from the server without any credentials, i.e., cookies.
        if (isDefined(options.crossOrigin)) {
            image.crossOrigin = mustBeString('crossOrigin', options.crossOrigin);
        }
        image.src = url;
    }
}
