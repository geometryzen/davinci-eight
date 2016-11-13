import { Facet } from '../core/Facet';
import { Geometric3 } from '../math/Geometric3';
import { Renderable } from '../core/Renderable';
import ShareableArray from '../collections/ShareableArray';
import { ShareableBase } from '../core/ShareableBase';

interface GroupMember extends Renderable {
    X: Geometric3;
    R: Geometric3;
}

const X = Geometric3.zero();
const R = Geometric3.zero();

/**
 * A collection of objects that can be added to the Scene.
 */
export default class Group extends ShareableBase implements GroupMember {

    private members: ShareableArray<GroupMember>;
    public X = Geometric3.zero();
    public R = Geometric3.one();

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
        this.members.forEach((member) => {
            // Make copies of member state so that it can be restored accurately.
            X.copyVector(member.X);
            R.copySpinor(member.R);

            member.X.rotate(this.R).add(this.X);

            member.R.mul2(this.R, member.R);

            member.render(ambients);

            // Resore the member state from the scratch variables.
            member.X.copyVector(X);
            member.R.copySpinor(R);
        });
    }
}
