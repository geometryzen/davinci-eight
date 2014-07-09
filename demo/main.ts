import e8 = require('src/eight');

// Strategic alias names to reduce clutter.
var scalar = e8.scalarE3;
var vector = e8.vectorE3;
var cos = Math.cos;
var sin = Math.sin;

// Assume pop-ups are not enabled until proven otherwise.
var popUpEnabled = false;

var glwin = window.open("", "", "width=800, height=600");

if (glwin) {
    popUpEnabled = true;
}
else {
    glwin = window;
    console.log("Pop-ups are currently blocked. You'll get more FPS in a Pop-up!");
}

glwin.document.body.style.backgroundColor = "202020";
glwin.document.body.style.overflow = "hidden";
glwin.document.title = "Visualizing Geometric Algebra with davinci-eight and WebGL";

var scene = e8.scene();

var camera = e8.perspective(45, 1.0, 0.1, 100);

var renderer = e8.renderer();

var box = e8.mesh(e8.box());
scene.add(box);
box.position = vector(-1.0, -0.5, -5.0);
var prism = e8.mesh(e8.prism());
scene.add(prism);
prism.position = vector(0.0, 0.0, -5.0);

var workbench = e8.workbench(renderer.canvas, renderer, camera, glwin);

function setUp() {
    workbench.setUp();
    monitor.start();
}

var B = e8.bivectorE3(0, 0, 1);
var angle = 0;

function tick(t: number) {
    var c = scalar(cos(angle / 2));
    var s = scalar(sin(angle / 2));
    var R = c.sub(B.mul(s));
    box.attitude = prism.attitude = R;

    renderer.render(scene, camera);
    angle += 0.01;
}

function terminate(t: number) { return false; }

function tearDown(e) {
    monitor.stop();
    if (popUpEnabled) {
        glwin.close();
    }
    if (e) {
        console.log("Error during animation: " + e);
    }
    else {
        console.log("Goodbye!");
        workbench.tearDown();
        scene.tearDown();
    }
}

var runner = e8.animationRunner(tick, terminate, setUp, tearDown, glwin);

function onContextLoss() {
    runner.stop();
    renderer.onContextLoss();
    scene.onContextLoss();
}

function onContextGain(gl: WebGLRenderingContext) {
    scene.onContextGain(gl);
    renderer.onContextGain(gl);
    renderer.context.clearColor(32 / 256, 32 / 256, 32 / 256, 1)
    runner.start();
}

var monitor = e8.contextMonitor(renderer.canvas, onContextLoss, onContextGain);

onContextGain(renderer.context);
