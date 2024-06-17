import { ShareableArray } from "../collections/ShareableArray";
import { Facet } from "../core/Facet";
import { Renderable } from "../core/Renderable";
import { ShareableBase } from "../core/ShareableBase";
import { Geometric3 } from "../math/Geometric3";
import { Matrix4 } from "../math/Matrix4";

/**
 * @hidden
 */
export interface GroupMember extends Renderable {
    X: Geometric3;
    R: Geometric3;
    visible: boolean;
}

/**
 * A collection of objects that can be treated as a single Renderable.
 * @hidden
 */
export class Group extends ShareableBase implements GroupMember {
    /**
     * The members of this group.
     */
    private members: ShareableArray<GroupMember>;
    /**
     * Position (vector). This is a short alias for the position property.
     */
    private pos = Geometric3.zero(false);
    /**
     * Attitude (spinor). This is a short alias for the attitude property.
     */
    private att = Geometric3.one(false);
    /**
     *
     */
    public stress = Matrix4.one.clone();
    /**
     * Determines whether this group will be rendered.
     */
    public visible = true;

    /**
     * Constructs
     */
    constructor() {
        super();
        this.setLoggingName("Group");
        this.members = new ShareableArray<GroupMember>([]);
    }

    /**
     *
     */
    protected destructor(levelUp: number): void {
        this.members.release();
        this.members = void 0;
        super.destructor(levelUp + 1);
    }

    /**
     * Position (vector). This is a long alias for the X property.
     */
    get position(): Geometric3 {
        return this.pos;
    }
    set position(value: Geometric3) {
        if (value) {
            this.pos.copyVector(value);
        }
    }
    get X(): Geometric3 {
        return this.pos;
    }
    set X(value: Geometric3) {
        if (value) {
            this.pos.copyVector(value);
        }
    }

    /**
     * Attitude (spinor). This is a long alias for the R property.
     */
    get attitude(): Geometric3 {
        return this.att;
    }
    set attitude(value: Geometric3) {
        if (value) {
            this.att.copySpinor(value);
        }
    }
    get R(): Geometric3 {
        return this.att;
    }
    set R(value: Geometric3) {
        if (value) {
            this.att.copySpinor(value);
        }
    }

    /**
     * Adds a Renderable item to this Group.
     */
    add(member: GroupMember): void {
        this.members.push(member);
    }

    /**
     * Removes a member item from this Group.
     */
    remove(member: GroupMember): void {
        const index = this.members.indexOf(member);
        if (index >= 0) {
            const ms = this.members.splice(index, 1);
            ms.release();
        } else {
            return void 0;
        }
    }

    /**
     * Renders all the members of this Group.
     */
    render(ambients: Facet[]): void {
        if (this.visible) {
            this.members.forEach((member) => {
                // Make copies of member state so that it can be restored accurately.
                // These calls are recursive so we need to use local temporary variables.
                const x = member.X.x;
                const y = member.X.y;
                const z = member.X.z;

                const a = member.R.a;
                const xy = member.R.xy;
                const yz = member.R.yz;
                const zx = member.R.zx;

                member.X.rotate(this.R).add(this.X);
                member.R.mul2(this.R, member.R);

                member.render(ambients);

                // Resore the member state from the scratch variables.
                member.X.x = x;
                member.X.y = y;
                member.X.z = z;

                member.R.a = a;
                member.R.xy = xy;
                member.R.yz = yz;
                member.R.zx = zx;
            });
        }
    }
}
