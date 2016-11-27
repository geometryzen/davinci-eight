import BeginMode from '../core/BeginMode';
import DataType from '../core/DataType';
import { Engine } from '../core/Engine';
import { Geometry } from '../core/Geometry';
import GeometryArrays from '../core/GeometryArrays';
import Group from './Group';
import ImageTexture from '../core/ImageTexture';
import isBoolean from '../checks/isBoolean';
import isNumber from '../checks/isNumber';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import Primitive from '../core/Primitive';
import vec from '../math/R3';
import { ShaderMaterial } from '../materials/ShaderMaterial';
import VectorE3 from '../math/VectorE3';

const e1 = vec(1, 0, 0);
const e2 = vec(0, 1, 0);

enum PartKind {
    Head,
    Helm,
    RightLeg,
    Torso,
    RightArm,
    LeftLeg,
    LeftArm,
    RightLegLayer2,
    TorsoLayer2,
    RightArmLayer2,
    LeftLegLayer2,
    LeftArmLayer2
}


interface MinecraftInternalBodyPartOptions {
    height: number;
    partKind: PartKind;
    oldSkinLayout: boolean;
    offset?: VectorE3;
}

enum Side {
    Top,
    Bottom,
    Right,
    Front,
    Left,
    Back
}

/**
 * The dimensions have been adjusted so that the total height of the figure is 1.
 */
function dimensions(part: PartKind, height: number): number[] {
    const LIMB_SIZE = 0.125 * height;
    const HEAD_SIZE = 0.25 * height;
    const TORSO_LENGTH = 0.375 * height;

    switch (part) {
        case PartKind.Head: {
            return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
        }
        case PartKind.Helm: {
            return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
        }
        case PartKind.LeftLeg:
        case PartKind.LeftLegLayer2:
        case PartKind.RightLeg:
        case PartKind.RightLegLayer2: {
            return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        case PartKind.Torso:
        case PartKind.TorsoLayer2: {
            return [HEAD_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        case PartKind.LeftArm:
        case PartKind.LeftArmLayer2:
        case PartKind.RightArm:
        case PartKind.RightArmLayer2: {
            return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        default: {
            throw new Error(`part: ${part}`);
        }
    }
}

function textureBounds(part: PartKind, side: Side, version: number, oldSkinLayout: boolean): number[] {
    switch (part) {
        case PartKind.Head: {
            switch (side) {
                case Side.Top: {
                    return [8, 0, 16, 8];
                }
                case Side.Bottom: {
                    if (oldSkinLayout) {
                        return [16, 0, 24, 8];
                    }
                    else {
                        return [24, 8, 16, 0];
                    }
                }
                case Side.Right: {
                    return [0, 8, 8, 16];
                }
                case Side.Front: {
                    return [8, 8, 16, 16];
                }
                case Side.Left: {
                    return [16, 8, 24, 16];
                }
                case Side.Back: {
                    return [24, 8, 32, 16];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.Helm: {
            switch (side) {
                case Side.Top: {
                    return [40, 0, 48, 8];
                }
                case Side.Bottom: {
                    return [48, 0, 56, 8];
                }
                case Side.Right: {
                    return [32, 8, 40, 16];
                }
                case Side.Front: {
                    return [40, 8, 48, 16];
                }
                case Side.Left: {
                    return [48, 8, 56, 16];
                }
                case Side.Back: {
                    return [56, 8, 64, 16];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.RightLeg: {
            switch (side) {
                case Side.Top: {
                    return [4, 16, 8, 20];
                }
                case Side.Bottom: {
                    return [8, 16, 12, 20];
                }
                case Side.Right: {
                    return [0, 20, 4, 32];
                }
                case Side.Front: {
                    return [4, 20, 8, 32];
                }
                case Side.Left: {
                    return [8, 20, 12, 32];
                }
                case Side.Back: {
                    return [12, 20, 16, 32];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.Torso: {
            switch (side) {
                case Side.Top: {
                    return [20, 16, 28, 20];
                }
                case Side.Bottom: {
                    return [28, 16, 36, 20];
                }
                case Side.Right: {
                    return [16, 20, 20, 32];
                }
                case Side.Front: {
                    return [20, 20, 28, 32];
                }
                case Side.Left: {
                    return [28, 20, 32, 32];
                }
                case Side.Back: {
                    return [32, 20, 40, 32];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.RightArm: {
            switch (side) {
                case Side.Top: {
                    return [44, 16, 48, 20];
                }
                case Side.Bottom: {
                    return [48, 16, 52, 20];
                }
                case Side.Right: {
                    return [40, 20, 44, 32];
                }
                case Side.Front: {
                    return [44, 20, 48, 32];
                }
                case Side.Left: {
                    return [48, 20, 52, 32];
                }
                case Side.Back: {
                    return [52, 20, 56, 32];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.LeftLeg: {
            if (version > 0) {
                switch (side) {
                    case Side.Top: {
                        return [20, 48, 24, 52];
                    }
                    case Side.Bottom: {
                        return [24, 48, 28, 52];
                    }
                    case Side.Right: {
                        return [16, 52, 20, 64];
                    }
                    case Side.Front: {
                        return [20, 52, 24, 64];
                    }
                    case Side.Left: {
                        return [24, 52, 28, 64];
                    }
                    case Side.Back: {
                        return [28, 52, 32, 64];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
            else {
                switch (side) {
                    case Side.Top: {
                        return [8, 16, 4, 20];
                    }
                    case Side.Bottom: {
                        return [12, 16, 8, 20];
                    }
                    case Side.Right: {
                        return [12, 20, 8, 32];
                    }
                    case Side.Front: {
                        return [8, 20, 4, 32];
                    }
                    case Side.Left: {
                        return [4, 20, 0, 32];
                    }
                    case Side.Back: {
                        return [16, 20, 12, 32];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
        }
        case PartKind.LeftArm: {
            if (version > 0) {
                switch (side) {
                    case Side.Top: {
                        return [36, 48, 40, 52];
                    }
                    case Side.Bottom: {
                        return [40, 48, 44, 52];
                    }
                    case Side.Right: {
                        return [32, 52, 36, 64];
                    }
                    case Side.Front: {
                        return [36, 52, 40, 64];
                    }
                    case Side.Left: {
                        return [40, 52, 44, 64];
                    }
                    case Side.Back: {
                        return [44, 52, 48, 64];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
            else {
                switch (side) {
                    case Side.Top: {
                        return [48, 16, 44, 20];
                    }
                    case Side.Bottom: {
                        return [52, 16, 48, 20];
                    }
                    case Side.Right: {
                        return [52, 20, 48, 32];
                    }
                    case Side.Front: {
                        return [48, 20, 44, 32];
                    }
                    case Side.Left: {
                        return [44, 20, 40, 32];
                    }
                    case Side.Back: {
                        return [56, 20, 52, 32];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
        }
        case PartKind.RightLegLayer2: {
            switch (side) {
                case Side.Top: {
                    return [4, 48, 8, 36];
                }
                case Side.Bottom: {
                    return [8, 48, 12, 36];
                }
                case Side.Right: {
                    return [0, 36, 4, 48];
                }
                case Side.Front: {
                    return [4, 36, 8, 48];
                }
                case Side.Left: {
                    return [8, 36, 12, 48];
                }
                case Side.Back: {
                    return [12, 36, 16, 48];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.TorsoLayer2: {
            switch (side) {
                case Side.Top: {
                    return [20, 48, 28, 36];
                }
                case Side.Bottom: {
                    return [28, 48, 36, 36];
                }
                case Side.Right: {
                    return [16, 36, 20, 48];
                }
                case Side.Front: {
                    return [20, 36, 28, 48];
                }
                case Side.Left: {
                    return [28, 36, 32, 48];
                }
                case Side.Back: {
                    return [32, 36, 40, 48];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.RightArmLayer2: {
            switch (side) {
                case Side.Top: {
                    return [44, 48, 48, 36];
                }
                case Side.Bottom: {
                    return [48, 48, 52, 36];
                }
                case Side.Right: {
                    return [40, 36, 44, 48];
                }
                case Side.Front: {
                    return [44, 36, 48, 48];
                }
                case Side.Left: {
                    return [48, 36, 52, 48];
                }
                case Side.Back: {
                    return [52, 36, 64, 48];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.LeftLegLayer2: {
            switch (side) {
                case Side.Top: {
                    return [4, 48, 8, 52];
                }
                case Side.Bottom: {
                    return [8, 48, 12, 52];
                }
                case Side.Right: {
                    return [0, 52, 4, 64];
                }
                case Side.Front: {
                    return [4, 52, 8, 64];
                }
                case Side.Left: {
                    return [8, 52, 12, 64];
                }
                case Side.Back: {
                    return [12, 52, 16, 64];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case PartKind.LeftArmLayer2: {
            switch (side) {
                case Side.Top: {
                    return [52, 48, 56, 52];
                }
                case Side.Bottom: {
                    return [56, 48, 60, 52];
                }
                case Side.Right: {
                    return [48, 52, 52, 64];
                }
                case Side.Front: {
                    return [52, 52, 56, 64];
                }
                case Side.Left: {
                    return [56, 52, 60, 64];
                }
                case Side.Back: {
                    return [60, 52, 64, 64];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        default: {
            throw new Error(`part: ${part}`);
        }
    }
}

function aCoords(part: PartKind, side: Side, width: number, height: number, oldSkinLayout: boolean): number[] {
    const cs = textureBounds(part, side, version(width, height), oldSkinLayout);
    const x1 = cs[0] / width;
    const y1 = cs[1] / height;
    const x2 = cs[2] / width;
    const y2 = cs[3] / height;
    return [x1, y2, x2, y2, x1, y1, x2, y2, x2, y1, x1, y1];
}

function version(width: number, height: number): number {
    if (width === 2 * height) {
        return 0;
    }
    else if (width === height) {
        return 1.8;
    }
    else {
        // Fallback to zero for greatest compatibility.
        return 0;
    }
}

function primitiveFromOptions(texture: ImageTexture, options: MinecraftInternalBodyPartOptions): Primitive {
    const partKind = options.partKind;
    const offset = options.offset ? options.offset : { x: 0, y: 0, z: 0 };
    const dims = dimensions(partKind, options.height);
    const positions = [
        // Front
        [-0.5, -0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, +0.5, +0.5],
        [+0.5, -0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5],
        // Back
        [+0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, +0.5, -0.5],
        [-0.5, -0.5, -0.5], [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5],
        // Left
        [+0.5, -0.5, +0.5], [+0.5, -0.5, -0.5], [+0.5, +0.5, +0.5],
        [+0.5, -0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5],
        // Right
        [-0.5, -0.5, -0.5], [-0.5, -0.5, +0.5], [-0.5, +0.5, -0.5],
        [-0.5, -0.5, +0.5], [-0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
        // Top
        [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, -0.5],
        [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5],
        // Bottom
        [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [-0.5, -0.5, +0.5],
        [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]
    ]
        .map(function (xs) { return [dims[0] * xs[0], dims[1] * xs[1], dims[2] * xs[2]]; })
        .map(function (xs) { return [xs[0] + offset.x, xs[1] + offset.y, xs[2] + offset.z]; })
        .reduce(function (a, b) { return a.concat(b); });

    const naturalScale = 64 / texture.naturalWidth;
    const width = texture.naturalWidth * naturalScale;
    const height = texture.naturalHeight * naturalScale;
    const oldSkinLayout = options.oldSkinLayout;
    const coords = [
        aCoords(partKind, Side.Front, width, height, oldSkinLayout),
        aCoords(partKind, Side.Back, width, height, oldSkinLayout),
        aCoords(partKind, Side.Left, width, height, oldSkinLayout),
        aCoords(partKind, Side.Right, width, height, oldSkinLayout),
        aCoords(partKind, Side.Top, width, height, oldSkinLayout),
        aCoords(partKind, Side.Bottom, width, height, oldSkinLayout)
    ].reduce(function (a, b) { return a.concat(b); });

    const primitive: Primitive = {
        mode: BeginMode.TRIANGLES,
        attributes: {
            aPosition: { values: positions, size: 3, type: DataType.FLOAT },
            aCoords: { values: coords, size: 2, type: DataType.FLOAT }
        }
    };
    return primitive;
}

function makeGeometry(graphics: Engine, texture: ImageTexture, options: MinecraftInternalBodyPartOptions): Geometry {
    return new GeometryArrays(graphics, primitiveFromOptions(texture, options));
}

const vs = [
    'attribute vec3 aPosition;',
    'attribute vec2 aCoords;',
    'uniform mat4 uModel;',
    'uniform mat4 uProjection;',
    'uniform mat4 uView;',
    'varying highp vec2 vCoords;',
    'void main(void) {',
    '  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);',
    '  vCoords = aCoords;',
    '}'
].join('\n');

const fs = [
    'precision mediump float;',
    'varying highp vec2 vCoords;',
    'uniform sampler2D uImage;',
    '  void main(void) {',
    '  gl_FragColor = texture2D(uImage, vec2(vCoords.s, vCoords.t));',
    '}'

].join('\n');

const makeMaterial = function makeMaterial(graphics: Engine, options: MinecraftInternalBodyPartOptions): Material {
    return new ShaderMaterial(vs, fs, [], graphics);
};

/**
 * 
 */
class MinecraftBodyPart extends Mesh<Geometry, Material> {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftInternalBodyPartOptions) {
        super(void 0, void 0, engine);
        this.setLoggingName('MinecraftBodyPart');
        const geometry = makeGeometry(engine, texture, options);
        this.geometry = geometry;
        geometry.release();
        const material = makeMaterial(engine, options);
        this.material = material;
        material.release();
        this.texture = texture;
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

interface MinecraftBodyPartOptions {
    height: number;
    oldSkinLayout?: boolean;
    offset?: VectorE3;
}

export class MinecraftHead extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftBodyPartOptions) {
        super(engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: PartKind.Head,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftHead');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

export class MinecraftTorso extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftBodyPartOptions) {
        super(engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: PartKind.Torso,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftTorso');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

export class MinecraftArmL extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftBodyPartOptions) {
        super(engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: PartKind.LeftArm,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftArmL');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

export class MinecraftArmR extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftBodyPartOptions) {
        super(engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: PartKind.RightArm,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftArmR');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

export class MinecraftLegL extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftBodyPartOptions) {
        super(engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: PartKind.LeftLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftLegL');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

export class MinecraftLegR extends MinecraftBodyPart {
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftBodyPartOptions) {
        super(engine, texture, {
            height: isNumber(options.height) ? options.height : 1,
            partKind: PartKind.RightLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftLegR');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

interface MinecraftFigureOptions {
    height?: number;
    oldSkinLayout?: boolean;
}

/**
 * A group of body parts arranged to look like a figure.
 */
export class MinecraftFigure extends Group {
    public head: MinecraftHead;
    public armL: MinecraftArmL;
    public armR: MinecraftArmR;
    public legL: MinecraftLegL;
    public legR: MinecraftLegR;
    public torso: MinecraftTorso;
    constructor(engine: Engine, texture: ImageTexture, options: MinecraftFigureOptions = {}) {
        super();
        const height = isNumber(options.height) ? options.height : 1;
        const scale = height / 32;
        const oldSkinLayout = isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false;
        this.head = new MinecraftHead(engine, texture, { height, offset: e2.scale(scale * 4), oldSkinLayout });
        this.head.position.zero().addVector(e2, scale * 24);
        this.add(this.head);
        this.head.release();

        this.torso = new MinecraftTorso(engine, texture, { height, oldSkinLayout });
        this.torso.position.zero().addVector(e2, scale * 18);
        this.add(this.torso);
        this.torso.release();

        this.armL = new MinecraftArmL(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.armL.position.zero().addVector(e2, scale * 22).addVector(e1, scale * 6);
        this.add(this.armL);
        this.armL.release();

        this.armR = new MinecraftArmR(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.armR.position.zero().addVector(e2, scale * 22).subVector(e1, scale * 6);
        this.add(this.armR);
        this.armR.release();

        this.legL = new MinecraftLegL(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.legL.position.zero().addVector(e2, scale * 10).addVector(e1, scale * 2);
        this.add(this.legL);
        this.legL.release();

        this.legR = new MinecraftLegR(engine, texture, { height, offset: e2.scale(-scale * 4), oldSkinLayout });
        this.legR.position.zero().addVector(e2, scale * 10).subVector(e1, scale * 2);
        this.add(this.legR);
        this.legR.release();
    }
}

