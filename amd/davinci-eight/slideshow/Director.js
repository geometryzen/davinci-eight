var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../scene/Canvas3D', '../utils/IUnknownArray', '../utils/NumberIUnknownMap', '../scene/Scene', '../utils/Shareable', '../slideshow/Slide', '../utils/StringIUnknownMap'], function (require, exports, Canvas3D, IUnknownArray, NumberIUnknownMap, Scene, Shareable, Slide, StringIUnknownMap) {
    var Director = (function (_super) {
        __extends(Director, _super);
        function Director() {
            _super.call(this, 'Director');
            this.slides = new IUnknownArray([], 'Director.slides');
            this.step = -1; // Position before the first slide.
            this.contexts = new NumberIUnknownMap();
            this.scenes = new StringIUnknownMap('Director.scenes');
            this.drawables = new StringIUnknownMap('Director.drawables');
            this.uniforms = new StringIUnknownMap('Director.uniforms');
            this.sceneNamesByCanvasId = {};
            this.uniformsByCanvasId = new NumberIUnknownMap();
        }
        Director.prototype.destructor = function () {
            this.slides.release();
            this.slides = void 0;
            this.contexts.forEach(function (canvasId, context) {
                context.stop();
            });
            this.contexts.release();
            this.contexts = void 0;
            this.scenes.release();
            this.scenes = void 0;
            this.drawables.release();
            this.drawables = void 0;
            this.uniforms.release();
            this.uniforms = void 0;
            this.uniformsByCanvasId.release();
            this.uniformsByCanvasId = void 0;
        };
        Director.prototype.apply = function (slide, forward) {
            if (forward) {
                slide.exec(this);
            }
            else {
                slide.undo(this);
            }
        };
        Director.prototype.addCanvasSceneLink = function (canvasId, sceneName) {
            var names = this.sceneNamesByCanvasId[canvasId];
            if (names) {
                names.push(sceneName);
            }
            else {
                this.sceneNamesByCanvasId[canvasId] = [sceneName];
            }
        };
        Director.prototype.addDrawable = function (name, drawable) {
            this.drawables.put(name, drawable);
        };
        Director.prototype.getDrawable = function (name) {
            return this.drawables.get(name);
        };
        Director.prototype.removeDrawable = function (name) {
            this.drawables.remove(name);
        };
        Director.prototype.addToScene = function (drawableId, sceneId) {
            var drawable = this.drawables.get(drawableId);
            var scene = this.scenes.get(sceneId);
            scene.add(drawable);
            drawable.release();
            scene.release();
        };
        Director.prototype.removeFromScene = function (drawableId, sceneId) {
            var drawable = this.drawables.get(drawableId);
            var scene = this.scenes.get(sceneId);
            scene.remove(drawable);
            drawable.release();
            scene.release();
        };
        Director.prototype.addFacet = function (name, uniform) {
            this.uniforms.put(name, uniform);
        };
        Director.prototype.removeFacet = function (name) {
            this.uniforms.remove(name);
        };
        Director.prototype.addCanvasUniformLink = function (canvasId, uniformName) {
            // FIXME: Verify that canvasId is a legitimate canvas.
            var uniform = this.uniforms.get(uniformName);
            if (uniform) {
                try {
                    var uniforms = this.uniformsByCanvasId.get(canvasId);
                    if (!uniforms) {
                        uniforms = new StringIUnknownMap('Director');
                        this.uniformsByCanvasId.put(canvasId, uniforms);
                    }
                    uniforms.put(uniformName, uniform);
                    uniforms.release();
                }
                finally {
                    uniform.release();
                }
            }
            else {
                console.warn(uniformName + ' is not a recognized facet');
            }
        };
        /**
         *
         */
        Director.prototype.createScene = function (sceneName, canvasIds) {
            var contexts = this.contexts;
            var monitors = canvasIds.map(function (canvasId) {
                return contexts.getWeakReference(canvasId);
            });
            var scene = new Scene(monitors);
            this.scenes.put(sceneName, scene);
            scene.release();
            var director = this;
            canvasIds.forEach(function (canvasId) {
                director.addCanvasSceneLink(canvasId, sceneName);
            });
        };
        Director.prototype.deleteScene = function (name) {
            if (this.scenes.exists(name)) {
                this.scenes.remove(name);
            }
        };
        Director.prototype.createSlide = function () {
            var slide = new Slide();
            this.slides.push(slide);
            return slide;
        };
        Director.prototype.getScene = function (name) {
            return this.scenes.get(name);
        };
        Director.prototype.go = function (step, instant) {
            if (instant === void 0) { instant = false; }
            if (this.slides.length === 0) {
                return;
            }
            while (step < 0)
                step += this.slides.length + 1;
        };
        Director.prototype.forward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canForward()) {
                return;
            }
            var slideIndex = this.step + 1;
            var slide = this.slides.get(slideIndex);
            try {
                var self = this;
                var apply = function () {
                    self.apply(slide, true);
                    self.step++;
                };
                if (delay) {
                    setTimeout(apply, delay);
                }
                else {
                    apply();
                }
            }
            finally {
                slide.release();
            }
        };
        Director.prototype.canForward = function () {
            return this.step < (this.slides.length - 1);
        };
        Director.prototype.backward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canBackward()) {
                return;
            }
            var slideIndex = this.step - 1;
            var slide = this.slides.get(slideIndex);
            var self = this;
            var apply = function () {
                self.apply(slide, false);
                self.step--;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
            slide.release();
        };
        Director.prototype.canBackward = function () {
            return this.step > 0;
        };
        Director.prototype.pushSlide = function (slide) {
            return this.slides.push(slide);
        };
        Director.prototype.addCanvas = function (canvas, canvasId) {
            var c3d = new Canvas3D();
            c3d.start(canvas, canvasId);
            this.contexts.put(canvasId, c3d);
            c3d.release();
        };
        Director.prototype.update = function (speed) {
            var slideIndex = this.step;
            if (slideIndex >= 0 && slideIndex < this.slides.length) {
                var slide = this.slides.get(slideIndex);
                if (slide) {
                    try {
                        slide.update(speed);
                    }
                    finally {
                        slide.release();
                    }
                }
                else {
                    // This should never happen if we manage the index properly.
                    console.warn("No slide found at index " + this.step);
                }
            }
        };
        Director.prototype.render = function () {
            var slideIndex = this.step;
            if (slideIndex >= 0 && slideIndex < this.slides.length) {
                var director = this;
                var canvasIds = this.contexts.keys;
                for (var i = 0, iLength = canvasIds.length; i < iLength; i++) {
                    var canvasId = canvasIds[i];
                    var c3d = this.contexts.get(canvasId);
                    c3d.prolog();
                    c3d.release();
                    var ambients = this.uniformsByCanvasId.get(canvasId);
                    // FIXME: scenesByCanvasId
                    var sceneNames = this.sceneNamesByCanvasId[canvasId];
                    if (sceneNames) {
                        for (var j = 0, jLength = sceneNames.length; j < jLength; j++) {
                            var sceneName = sceneNames[j];
                            var scene = this.scenes.get(sceneNames[j]);
                            scene.draw(ambients.values, canvasId);
                            scene.release();
                        }
                    }
                    ambients.release();
                }
            }
        };
        return Director;
    })(Shareable);
    return Director;
});
