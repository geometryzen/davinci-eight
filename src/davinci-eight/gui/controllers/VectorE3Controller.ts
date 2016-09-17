import Picker from './Picker';
import Vector from './Vector';
import Matrix from './Matrix';
import binding from '../dom/binding';
import Bindable from '../dom/Bindable';
import addClass from '../dom/addClass';
import VectorE3 from '../../math/VectorE3';

interface Shape {
    nodeColour?: string;
    nodeRadius?: number;
    edgeColour?: string;
    textColour?: string;
    nodes: number[][];
    edges?: number[][];
    text?: string[];
}

function point(v: VectorE3, scale: number): number[] {
    return [v.x * scale, v.y * scale, v.z * scale];
}

export default class VectorE3Controller extends Picker<VectorE3> {
    scale: number;
    camera: Matrix;
    shapes: Shape[];
    center: number[];
    /**
     * The previous position of the mouse (offsetX, offsetY).
     */
    prevMouseOffsetXY: number[];
    overPoint: boolean;
    // Why do I need to repeat this?
    // point: number[];
    private __elementDblClickBinding: Bindable;
    constructor(object: {}, property: string, properties?: {}) {
        super(object, property, 'ge_vectorE3Controller_', properties);

        this.width = this.width || 200;
        this.height = this.width || 200;
        this.scale = 50;

        this.camera = new Matrix();
        this.shapes = [];
        this.center = [0, 0, 0];

        this.shapes.push({
            edgeColour: this.dimColor,
            nodes: [[this.width / 2 - 50, this.height / 2, 100], [this.width / 2 + 50, this.height / 2, 100],
                [this.width / 2, this.height / 2 - 50, 100], [this.width / 2, this.height / 2 + 50, 100],
                [this.width / 2, this.height / 2, 50], [this.width / 2, this.height / 2, 150]],
            edges: [[0, 1], [2, 3], [4, 5]]
        });

        this.shapes.push({
            textColour: this.fnColor,
            nodes: [[this.width / 2 + 68, this.height / 2, 100], [this.width / 2 - 68, this.height / 2, 100],
                [this.width / 2, this.height / 2 + 68, 100], [this.width / 2, this.height / 2 - 68, 100],
                [this.width / 2, this.height / 2, 168], [this.width / 2, this.height / 2, 32]],
            text: ['x', '-x', 'y', '-y', 'z', '-z']
        });

        this.setCenter(this.width / 2, this.height / 2, 100);

        // Mouse events
        this.prevMouseOffsetXY = [0, 0];
        this.overPoint = false;

        this.updateDisplay();
    }

    complete(): void {
        addClass(this.__li, 'vector');
    }

    setCenter(x: number, y: number, z: number): void {
        for (let s = 0; s < this.shapes.length; s++) {
            const shape = this.shapes[s];
            for (let n = 0; n < shape.nodes.length; n++) {
                shape.nodes[n][0] -= x;
                shape.nodes[n][1] -= y;
                shape.nodes[n][2] -= z;
            }
        }
        this.center = [x, y, z];
    }

    /**
     * Converts vector X in space to mouse coordinates using the camera.
     * X is in RR^3
     * Returns RR^2
     */
    viewFromCamera(X: number[]): number[] {
        const A = this.camera.getMult(X);
        A.add(this.center);
        return [A.x, this.height - A.y];
    }

    protected updateDisplay(): void {
        // console.log(`width, height => ${this.width}, ${this.height}`);
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let s = 0; s < this.shapes.length; s++) {
            const shape = this.shapes[s];
            if (shape.edgeColour) {
                this.drawShapeEdges(shape);
            }
            if (shape.nodeColour) {
                this.drawShapeNodes(shape);
            }
            if (shape.text) {
                this.drawShapeText(shape);
            }
        }

        const X = point(this.getValue(), this.scale);
        // The line from the origin to the point.
        this.drawShapeEdges({
            edgeColour: this.fnColor,
            nodes: [[0, 0, 0], X],
            edges: [[0, 1]]
        });

        // The point itself.
        this.drawShapeNodes({
            nodeColour: this.overPoint ? this.selColor : this.fnColor,
            nodeRadius: this.overPoint ? 4 : 2,
            nodes: [X]
        });
    }

    drawShapeEdges(shape: Shape): void {
        let nodes = shape.nodes;

        this.ctx.strokeStyle = shape.edgeColour;
        for (let e = 0; e < shape.edges.length; e++) {
            const node = nodes[shape.edges[e][0]];
            let coord = this.viewFromCamera(node);
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(coord[0], coord[1]);
            coord = this.viewFromCamera(nodes[shape.edges[e][1]]);
            this.ctx.lineTo(coord[0], coord[1]);
            this.ctx.stroke();
        }
    }

    drawShapeNodes(shape: Shape): void {
        let radius = shape.nodeRadius || 4;
        this.ctx.fillStyle = shape.nodeColour;
        for (let n = 0; n < shape.nodes.length; n++) {
            const coord = this.viewFromCamera(shape.nodes[n]);
            this.ctx.beginPath();
            this.ctx.arc(coord[0], coord[1], radius, 0, 2 * Math.PI, false);
            this.ctx.fill();
        }
    }

    drawShapeText(shape: Shape): void {
        this.ctx.fillStyle = shape.textColour;
        for (let n = 0; n < shape.nodes.length; n++) {
            let coord = this.viewFromCamera(shape.nodes[n]);
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(shape.text[n], coord[0], coord[1]);
        }
    }

    /**
     * This is an Override.
     */
    protected onMouseDown(mouseDownEvent: MouseEvent) {
        const mouse = [mouseDownEvent.offsetX, mouseDownEvent.offsetY];
        this.prevMouseOffsetXY = mouse;

        // Project the point onto the mouse coordinates plane.
        const pos = new Vector(this.viewFromCamera(point(this.getValue(), this.scale)));
        const diff = pos.getSub(mouse);
        this.overPoint = diff.getLength() < 10;

        // This is a bit of a tricky protocol.
        super.onMouseDown(mouseDownEvent);
        this.__elementDblClickBinding = binding(this.__selector, 'dblclick', (dblClickEvent: MouseEvent) => {
            const mouse = new Vector([dblClickEvent.offsetX, dblClickEvent.offsetY]);
            const axes: { [name: string]: number[] } = {
                x: [68, 0, 0],
                neg_x: [-68, 0, 0],
                y: [0, 68, 100],
                neg_y: [0, -68, 0]
            };
            let selected = '';
            for (let axisName in axes) {
                if (axes.hasOwnProperty(axisName)) {
                    const pos = new Vector(this.viewFromCamera(axes[axisName]));
                    const diff = pos.getSub(mouse);
                    if (diff.getLength() < 10) {
                        selected = axisName;
                        break;
                    }
                }
            }
            this.camera = new Matrix();

            if (selected === 'x') {
                this.camera.rotateY(-1.57079632679);
            }
            else if (selected === 'neg_x') {
                this.camera.rotateY(1.57079632679);
            }
            else if (selected === 'y') {
                this.camera.rotateX(-1.57079632679);
            }
            else if (selected === 'neg_y') {
                this.camera.rotateX(1.57079632679);
            }

            this.updateDisplay();

        }).bind();
    }

    /**
     * Override of the Picker base class.
     * If we are over the point, we move that, otherwise rotate the camera.
     */
    protected onMouseMove(event: MouseEvent) {
        // console.log(`onMouseMove`);
        const x = event.offsetX;
        const y = event.offsetY;

        const dx = 0.01 * (x - this.prevMouseOffsetXY[0]);
        const dy = 0.01 * (y - this.prevMouseOffsetXY[1]);

        if (this.overPoint) {
            let invM = this.camera.getInv();
            let vel = invM.getMult([dx, -dy, 0.0]);
            vel.mult(2);
            const value = super.getValue();
            const x = value.x + vel.x;
            const y = value.y + vel.y;
            const z = value.z + vel.z;
            value.x = x;
            value.y = y;
            value.z = z;
            super.setValue(value);
        }
        else {
            this.camera.rotateX(dy);
            this.camera.rotateY(dx);
        }

        this.prevMouseOffsetXY = [x, y];
        super.onMouseMove(event);
    }

    /**
     * Override
     */
    protected destroyEvents() {
        super.destroyEvents();
        if (this.__elementDblClickBinding) {
            this.__elementDblClickBinding.unbind();
            this.__elementDblClickBinding = void 0;
        }
    }
}
