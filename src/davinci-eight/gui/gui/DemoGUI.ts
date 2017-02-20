import GUI from './GUI';

export default class DemoGUI extends GUI {
    yesno = false;
    answer = 42;
    message = "Hello, World!";
    color = "#4a65a4";
    vectorE1 = 5;
    vectorE2 = { x: 1, y: 0 };
    vectorE3 = { x: 1, y: 0, z: 0 };
    constructor() {
        super();
        this.add(this, 'message');
        this.add(this, 'yesno');
        this.add(this, 'answer');
        this.add(this, 'doIt');
        this.addColor(this, 'color');
        this.addVectorE1(this, 'vectorE1');
        this.addVectorE2(this, 'vectorE2');
        this.addVectorE3(this, 'vectorE3');
        // const more = this.addFolder("More Stuff");
        // more.add(this, 'yesno');
        // more.add(this, 'message');
    }
    doIt() {
        // Do nothing
    }
}
