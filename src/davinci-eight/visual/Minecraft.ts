import BeginMode from '../core/BeginMode';
import DataType from '../core/DataType';
import { Engine } from '../core/Engine';
import { Geometry } from '../core/Geometry';
import GeometryArrays from '../core/GeometryArrays';
import ImageTexture from '../core/ImageTexture';
import isBoolean from '../checks/isBoolean';
import isNumber from '../checks/isNumber';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import Primitive from '../core/Primitive';
import { ShaderMaterial } from '../materials/ShaderMaterial';
import VectorE3 from '../math/VectorE3';

enum MinecraftPartKind {
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
    partKind: MinecraftPartKind;
    oldSkinLayout: boolean;
    offset?: VectorE3;
}

enum MinecraftSide {
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
function dimensions(part: MinecraftPartKind, height: number): number[] {
    const LIMB_SIZE = 0.125 * height;
    const HEAD_SIZE = 0.25 * height;
    const TORSO_LENGTH = 0.375 * height;

    switch (part) {
        case MinecraftPartKind.Head: {
            return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
        }
        case MinecraftPartKind.Helm: {
            return [HEAD_SIZE, HEAD_SIZE, HEAD_SIZE];
        }
        case MinecraftPartKind.LeftLeg:
        case MinecraftPartKind.LeftLegLayer2:
        case MinecraftPartKind.RightLeg:
        case MinecraftPartKind.RightLegLayer2: {
            return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        case MinecraftPartKind.Torso:
        case MinecraftPartKind.TorsoLayer2: {
            return [HEAD_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        case MinecraftPartKind.LeftArm:
        case MinecraftPartKind.LeftArmLayer2:
        case MinecraftPartKind.RightArm:
        case MinecraftPartKind.RightArmLayer2: {
            return [LIMB_SIZE, TORSO_LENGTH, LIMB_SIZE];
        }
        default: {
            throw new Error(`part: ${part}`);
        }
    }
}

function textureBounds(part: MinecraftPartKind, side: MinecraftSide, version: number, oldSkinLayout: boolean): number[] {
    switch (part) {
        case MinecraftPartKind.Head: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [8, 0, 16, 8];
                }
                case MinecraftSide.Bottom: {
                    if (oldSkinLayout) {
                        return [16, 0, 24, 8];
                    }
                    else {
                        return [24, 8, 16, 0];
                    }
                }
                case MinecraftSide.Right: {
                    return [0, 8, 8, 16];
                }
                case MinecraftSide.Front: {
                    return [8, 8, 16, 16];
                }
                case MinecraftSide.Left: {
                    return [16, 8, 24, 16];
                }
                case MinecraftSide.Back: {
                    return [24, 8, 32, 16];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.Helm: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [40, 0, 48, 8];
                }
                case MinecraftSide.Bottom: {
                    return [48, 0, 56, 8];
                }
                case MinecraftSide.Right: {
                    return [32, 8, 40, 16];
                }
                case MinecraftSide.Front: {
                    return [40, 8, 48, 16];
                }
                case MinecraftSide.Left: {
                    return [48, 8, 56, 16];
                }
                case MinecraftSide.Back: {
                    return [56, 8, 64, 16];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.RightLeg: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [4, 16, 8, 20];
                }
                case MinecraftSide.Bottom: {
                    return [8, 16, 12, 20];
                }
                case MinecraftSide.Right: {
                    return [0, 20, 4, 32];
                }
                case MinecraftSide.Front: {
                    return [4, 20, 8, 32];
                }
                case MinecraftSide.Left: {
                    return [8, 20, 12, 32];
                }
                case MinecraftSide.Back: {
                    return [12, 20, 16, 32];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.Torso: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [20, 16, 28, 20];
                }
                case MinecraftSide.Bottom: {
                    return [28, 16, 36, 20];
                }
                case MinecraftSide.Right: {
                    return [16, 20, 20, 32];
                }
                case MinecraftSide.Front: {
                    return [20, 20, 28, 32];
                }
                case MinecraftSide.Left: {
                    return [28, 20, 32, 32];
                }
                case MinecraftSide.Back: {
                    return [32, 20, 40, 32];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.RightArm: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [44, 16, 48, 20];
                }
                case MinecraftSide.Bottom: {
                    return [48, 16, 52, 20];
                }
                case MinecraftSide.Right: {
                    return [40, 20, 44, 32];
                }
                case MinecraftSide.Front: {
                    return [44, 20, 48, 32];
                }
                case MinecraftSide.Left: {
                    return [48, 20, 52, 32];
                }
                case MinecraftSide.Back: {
                    return [52, 20, 56, 32];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.LeftLeg: {
            if (version > 0) {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [20, 48, 24, 52];
                    }
                    case MinecraftSide.Bottom: {
                        return [24, 48, 28, 52];
                    }
                    case MinecraftSide.Right: {
                        return [16, 52, 20, 64];
                    }
                    case MinecraftSide.Front: {
                        return [20, 52, 24, 64];
                    }
                    case MinecraftSide.Left: {
                        return [24, 52, 28, 64];
                    }
                    case MinecraftSide.Back: {
                        return [28, 52, 32, 64];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
            else {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [8, 16, 4, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [12, 16, 8, 20];
                    }
                    case MinecraftSide.Right: {
                        return [12, 20, 8, 32];
                    }
                    case MinecraftSide.Front: {
                        return [8, 20, 4, 32];
                    }
                    case MinecraftSide.Left: {
                        return [4, 20, 0, 32];
                    }
                    case MinecraftSide.Back: {
                        return [16, 20, 12, 32];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
        }
        case MinecraftPartKind.LeftArm: {
            if (version > 0) {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [36, 48, 40, 52];
                    }
                    case MinecraftSide.Bottom: {
                        return [40, 48, 44, 52];
                    }
                    case MinecraftSide.Right: {
                        return [32, 52, 36, 64];
                    }
                    case MinecraftSide.Front: {
                        return [36, 52, 40, 64];
                    }
                    case MinecraftSide.Left: {
                        return [40, 52, 44, 64];
                    }
                    case MinecraftSide.Back: {
                        return [44, 52, 48, 64];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
            else {
                switch (side) {
                    case MinecraftSide.Top: {
                        return [48, 16, 44, 20];
                    }
                    case MinecraftSide.Bottom: {
                        return [52, 16, 48, 20];
                    }
                    case MinecraftSide.Right: {
                        return [52, 20, 48, 32];
                    }
                    case MinecraftSide.Front: {
                        return [48, 20, 44, 32];
                    }
                    case MinecraftSide.Left: {
                        return [44, 20, 40, 32];
                    }
                    case MinecraftSide.Back: {
                        return [56, 20, 52, 32];
                    }
                    default: {
                        throw new Error(`${side}`);
                    }
                }
            }
        }
        case MinecraftPartKind.RightLegLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [4, 48, 8, 36];
                }
                case MinecraftSide.Bottom: {
                    return [8, 48, 12, 36];
                }
                case MinecraftSide.Right: {
                    return [0, 36, 4, 48];
                }
                case MinecraftSide.Front: {
                    return [4, 36, 8, 48];
                }
                case MinecraftSide.Left: {
                    return [8, 36, 12, 48];
                }
                case MinecraftSide.Back: {
                    return [12, 36, 16, 48];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.TorsoLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [20, 48, 28, 36];
                }
                case MinecraftSide.Bottom: {
                    return [28, 48, 36, 36];
                }
                case MinecraftSide.Right: {
                    return [16, 36, 20, 48];
                }
                case MinecraftSide.Front: {
                    return [20, 36, 28, 48];
                }
                case MinecraftSide.Left: {
                    return [28, 36, 32, 48];
                }
                case MinecraftSide.Back: {
                    return [32, 36, 40, 48];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.RightArmLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [44, 48, 48, 36];
                }
                case MinecraftSide.Bottom: {
                    return [48, 48, 52, 36];
                }
                case MinecraftSide.Right: {
                    return [40, 36, 44, 48];
                }
                case MinecraftSide.Front: {
                    return [44, 36, 48, 48];
                }
                case MinecraftSide.Left: {
                    return [48, 36, 52, 48];
                }
                case MinecraftSide.Back: {
                    return [52, 36, 64, 48];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.LeftLegLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [4, 48, 8, 52];
                }
                case MinecraftSide.Bottom: {
                    return [8, 48, 12, 52];
                }
                case MinecraftSide.Right: {
                    return [0, 52, 4, 64];
                }
                case MinecraftSide.Front: {
                    return [4, 52, 8, 64];
                }
                case MinecraftSide.Left: {
                    return [8, 52, 12, 64];
                }
                case MinecraftSide.Back: {
                    return [12, 52, 16, 64];
                }
                default: {
                    throw new Error(`${side}`);
                }
            }
        }
        case MinecraftPartKind.LeftArmLayer2: {
            switch (side) {
                case MinecraftSide.Top: {
                    return [52, 48, 56, 52];
                }
                case MinecraftSide.Bottom: {
                    return [56, 48, 60, 52];
                }
                case MinecraftSide.Right: {
                    return [48, 52, 52, 64];
                }
                case MinecraftSide.Front: {
                    return [52, 52, 56, 64];
                }
                case MinecraftSide.Left: {
                    return [56, 52, 60, 64];
                }
                case MinecraftSide.Back: {
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

function aCoords(part: MinecraftPartKind, side: MinecraftSide, width: number, height: number, oldSkinLayout: boolean): number[] {
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

    const naturalWidth = texture instanceof ImageTexture ? texture.naturalWidth : 64;
    const naturalHeight = texture instanceof ImageTexture ? texture.naturalHeight : 64;
    const naturalScale = 64 / naturalWidth;
    const width = naturalWidth * naturalScale;
    const height = naturalHeight * naturalScale;
    const oldSkinLayout = options.oldSkinLayout;
    const coords = [
        aCoords(partKind, MinecraftSide.Front, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Back, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Left, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Right, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Top, width, height, oldSkinLayout),
        aCoords(partKind, MinecraftSide.Bottom, width, height, oldSkinLayout)
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
            partKind: MinecraftPartKind.Head,
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
            partKind: MinecraftPartKind.Torso,
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
            partKind: MinecraftPartKind.LeftArm,
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
            partKind: MinecraftPartKind.RightArm,
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
            partKind: MinecraftPartKind.LeftLeg,
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
            partKind: MinecraftPartKind.RightLeg,
            offset: options.offset,
            oldSkinLayout: isBoolean(options.oldSkinLayout) ? options.oldSkinLayout : false
        });
        this.setLoggingName('MinecraftLegR');
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}

