import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
/**
 * Deprecated support for 'position' and 'attitude' in options.
 * Implementations should use the corresponding properties instead.
 */
export declare function setDeprecatedOptions(mesh: Mesh<Geometry, Material>, options: {}): void;
