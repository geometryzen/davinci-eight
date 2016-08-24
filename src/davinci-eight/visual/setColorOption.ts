import {Color} from '../core/Color';
import isDefined from '../checks/isDefined';
import {Mesh} from '../core/Mesh';
import VisualOptions from './VisualOptions';

export default function setColorOption(mesh: Mesh, options: VisualOptions, defaultColor: Color): void {
    if (isDefined(options.color)) {
        mesh.color.copy(options.color);
    }
    else if (isDefined(defaultColor)) {
        mesh.color.copy(defaultColor);
    }
}
