import { Facet } from '../core/Facet';
import { Geometric3 } from '../math/Geometric3';
import Matrix4 from '../math/Matrix4';
import { Renderable } from '../core/Renderable';
import ShareableArray from '../collections/ShareableArray';
import { ShareableBase } from '../core/ShareableBase';

interface GroupMember extends Renderable {
    X: Geometric3;
    R: Geometric3;
    stress: Matrix4;
    visible: boolean;
}

/**
 * A collection of objects that can be added to the Scene.
 */
export default class Group extends ShareableBase implements GroupMember {

    private members: ShareableArray<GroupMember>;
    public X = Geometric3.zero();
    public R = Geometric3.one();
    public stress = Matrix4.one();
    public visible = true;

    constructor() {
        super();
        this.setLoggingName('Group');
        this.members = new ShareableArray<GroupMember>([]);
    }

    protected destructor(levelUp: number): void {
        this.members.release();
        this.members = void 0;
        super.destructor(levelUp + 1);
    }

    get position(): Geometric3 {
        return this.X;
    }
    set position(value: Geometric3) {
        if (value) {
            this.X.copyVector(value);
        }
    }

    get attitude(): Geometric3 {
        return this.R;
    }
    set attitude(value: Geometric3) {
        if (value) {
            this.R.copySpinor(value);
        }
    }

    add(member: GroupMember): void {
        this.members.push(member);
    }

    /**
     * 
     */
    remove(member: GroupMember): void {
        const index = this.members.indexOf(member);
        if (index >= 0) {
            const ms = this.members.splice(index, 1);
            ms.release();
        }
        else {
            return void 0;
        }
    }

    /**
     *
     */
    render(ambients: Facet[]): void {
        if (this.visible) {
            this.members.forEach((member) => {
                // Make copies of member state so that it can be restored accurately.
                // These calls are recursive so wen need to use local temporary variables.
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
