import { ContextManager } from '../core/ContextManager';
import { ImageTexture } from '../core/ImageTexture';
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
export declare class TextureLoader {
    private contextManager;
    /**
     * @param contextManager
     */
    constructor(contextManager: ContextManager);
    /**
     * @param url The Uniform Resource Locator of the image.
     * @param onLoad
     * @param onError
     */
    loadImageTexture(url: string, onLoad: (texture: ImageTexture) => any, onError?: () => any, options?: TextureLoaderOptions): void;
}
