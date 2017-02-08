import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Vector3 from '../math/Vector3';
import VectorN from '../atoms/VectorN';
import wedgeXY from '../math/wedgeXY';
import wedgeYZ from '../math/wedgeYZ';
import wedgeZX from '../math/wedgeZX';

export default function computeFaceNormals(simplex: Simplex, positionName = GraphicsProgramSymbols.ATTRIBUTE_POSITION, normalName = GraphicsProgramSymbols.ATTRIBUTE_NORMAL): void {
    const vertex0 = simplex.vertices[0].attributes;
    const vertex1 = simplex.vertices[1].attributes;
    const vertex2 = simplex.vertices[2].attributes;

    const pos0: VectorN<number> = vertex0[positionName];
    const pos1: VectorN<number> = vertex1[positionName];
    const pos2: VectorN<number> = vertex2[positionName];

    const x0: number = pos0.getComponent(0);
    const y0: number = pos0.getComponent(1);
    const z0: number = pos0.getComponent(2);

    const x1: number = pos1.getComponent(0);
    const y1: number = pos1.getComponent(1);
    const z1: number = pos1.getComponent(2);

    const x2: number = pos2.getComponent(0);
    const y2: number = pos2.getComponent(1);
    const z2: number = pos2.getComponent(2);

    const ax = x2 - x1;
    const ay = y2 - y1;
    const az = z2 - z1;

    const bx = x0 - x1;
    const by = y0 - y1;
    const bz = z0 - z1;

    const x = wedgeYZ(ax, ay, az, bx, by, bz);
    const y = wedgeZX(ax, ay, az, bx, by, bz);
    const z = wedgeXY(ax, ay, az, bx, by, bz);

    const normal = new Vector3([x, y, z]).normalize();

    vertex0[normalName] = normal;
    vertex1[normalName] = normal;
    vertex2[normalName] = normal;
}
