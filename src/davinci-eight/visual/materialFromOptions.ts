import ContextManager from '../core/ContextManager';
import { Material } from '../core/Material';
import LineMaterialOptions from '../materials/LineMaterialOptions';
import { LineMaterial } from '../materials/LineMaterial';
import { MeshMaterial } from '../materials/MeshMaterial';
import MeshMaterialOptions from '../materials/MeshMaterialOptions';
import PointMaterialOptions from '../materials/PointMaterialOptions';
import { PointMaterial } from '../materials/PointMaterial';
import SimplexMode from '../geometries/SimplexMode';

export default function materialFromOptions(contextManager: ContextManager, simplexMode: SimplexMode, options: {}): Material {
    switch (simplexMode) {
        case SimplexMode.POINT: {
            const matOptions: PointMaterialOptions = void 0;
            return new PointMaterial(contextManager, matOptions);
        }
        case SimplexMode.LINE: {
            const matOptions: LineMaterialOptions = void 0;
            return new LineMaterial(contextManager, matOptions);
        }
        default: {
            const matOptions: MeshMaterialOptions = void 0;
            return new MeshMaterial(contextManager, matOptions);
        }
    }
}
