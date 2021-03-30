import { Color } from '../core/Color';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
/**
 * @hidden
 */
export declare function setColorOption(mesh: Mesh<Geometry, Material>, options: {
    color?: {
        r: number;
        g: number;
        b: number;
    };
}, defaultColor: Color): void;
