import { Color } from '../core/Color';
import { Geometry } from '../core/Geometry';
import isDefined from '../checks/isDefined';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';

export default function setColorOption(mesh: Mesh<Geometry, Material>, options: { color?: { r: number; g: number; b: number } }, defaultColor: Color): void {
    if (isDefined(options.color)) {
        mesh.color.copy(options.color);
    }
    else if (isDefined(defaultColor)) {
        mesh.color.copy(defaultColor);
    }
}
