import contextManagerFromOptions from './contextManagerFromOptions';
import {Material} from '../core/Material';
import LineMaterialOptions from '../materials/LineMaterialOptions';
import {LineMaterial} from '../materials/LineMaterial';
import {MeshMaterial} from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import PointMaterialOptions from '../materials/PointMaterialOptions';
import {PointMaterial} from '../materials/PointMaterial';
import VisualOptions from './VisualOptions';

export default function materialFromOptions(k: number, options: VisualOptions): Material {
    switch (k) {
        case 0: {
            const matOptions: PointMaterialOptions = void 0;
            return new PointMaterial(matOptions, contextManagerFromOptions(options));
        }
        case 1: {
            const matOptions: LineMaterialOptions = void 0;
            return new LineMaterial(matOptions, contextManagerFromOptions(options));
        }
        default: {
            const matOptions: MeshMaterialOptions = void 0;
            return new MeshMaterial(matOptions, contextManagerFromOptions(options));
        }
    }
}
