import {Color} from '../core/Color';
import {Geometry} from '../core/Geometry';
import isDefined from '../checks/isDefined';
import {Material} from '../core/Material';
import {Mesh} from '../core/Mesh';
import VisualOptions from './VisualOptions';

export default function setColorOption(mesh: Mesh<Geometry, Material>, options: VisualOptions, defaultColor: Color): void {
    if (isDefined(options.color)) {
        mesh.color.copy(options.color);
    }
    else if (isDefined(defaultColor)) {
        mesh.color.copy(defaultColor);
    }
}
