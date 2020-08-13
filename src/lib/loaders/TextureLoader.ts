import { isDefined } from '../checks/isDefined';
import { isFunction } from '../checks/isFunction';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeString } from '../checks/mustBeString';
import { ContextManager } from '../core/ContextManager';
import { ImageTexture } from '../core/ImageTexture';
import { TextureTarget } from '../core/TextureTarget';
import { TextureLoaderOptions } from './TextureLoaderOptions';

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
     * 
     * @param url The Uniform Resource Locator of the image.
     * @param options 
     */
    imageTexture(url: string, options: TextureLoaderOptions = {}): Promise<ImageTexture> {
        mustBeString('url', url);
        if (isDefined(options.crossOrigin)) {
            mustBeString('options.crossOrigin', options.crossOrigin);
        }
        return new Promise<ImageTexture>((response, reject) => {
            const image = new Image();
            image.onload = () => {
                const texture = new ImageTexture(image, TextureTarget.TEXTURE_2D, this.contextManager);
                texture.bind();
                texture.upload();
                texture.unbind();
                response(texture);
            };
            image.onerror = (event: string | Event, source: string, lineno: number, colno: number, error: Error) => {
                console.log(`event=${event}: ${typeof event}, source=${source}, lineno=${lineno}, colno=${colno}, error=${error}`);
                reject(new Error(`Error occurred while loading image. Cause: ${error}`));
            };
            // How to issue a CORS request for an image coming from another domain.
            // The image is fetched from the server without any credentials, i.e., cookies.
            if (isDefined(options.crossOrigin)) {
                image.crossOrigin = options.crossOrigin;
            }
            image.src = url;
        });
    }

    /**
     * @deprecated
     * @param url The Uniform Resource Locator of the image.
     * @param onLoad
     * @param onError
     * @param options
     */
    loadImageTexture(url: string, onLoad: (texture: ImageTexture) => any, onError?: () => any, options: TextureLoaderOptions = {}): void {
        console.warn("loadImageTexture() is deprecated. Please use imageTexture().");
        mustBeFunction('onLoad', onLoad);
        if (isDefined(onError)) {
            mustBeFunction('onError', onError);
        }
        this.imageTexture(url, options)
            .then((texture) => {
                onLoad(texture);
            })
            .catch((err) => {
                if (isFunction(onError)) {
                    onError();
                }
            });
    }
}
