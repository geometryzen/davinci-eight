var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../slideshow/Slide', '../utils/IUnknownArray', '../utils/NumberIUnknownMap', '../utils/Shareable', '../utils/StringIUnknownMap'], function (require, exports, Slide, IUnknownArray, NumberIUnknownMap, Shareable, StringIUnknownMap) {
    ///////////////////////////////////////////////////////////////////////////////
    // Design Ideas:
    // 1. Should be able to attach itself to an EIGHT program and drive it.
    // 2. Should be able to create the elements of an EIGHT program.
    //
    /**
     * @class Director
     */
    var Director = (function (_super) {
        __extends(Director, _super);
        /**
         * @class Director
         * @constructor
         */
        function Director() {
            _super.call(this, 'Director');
            this.slides = new IUnknownArray([], 'Director.slides');
            this.step = -1; // Position before the first slide.
            // this.contexts = new NumberIUnknownMap<Canvas3D>()
            this.scenes = new StringIUnknownMap('Director.scenes');
            this.drawables = new StringIUnknownMap('Director.drawables');
            this.geometries = new StringIUnknownMap('Director.geometries');
            this.uniforms = new StringIUnknownMap('Director.uniforms');
            this.sceneNamesByCanvasId = {};
            this.uniformsByCanvasId = new NumberIUnknownMap();
        }
        Director.prototype.destructor = function () {
            this.slides.release();
            this.slides = void 0;
            //this.contexts.forEach(function(canvasId, context) {
            //context.stop()
            //})
            //this.contexts.release()
            //this.contexts = void 0
            this.scenes.release();
            this.scenes = void 0;
            this.drawables.release();
            this.drawables = void 0;
            this.geometries.release();
            this.geometries = void 0;
            this.uniforms.release();
            this.uniforms = void 0;
            this.uniformsByCanvasId.release();
            this.uniformsByCanvasId = void 0;
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
        Director.prototype.addGeometry = function (name, geometry) {
            this.geometries.put(name, geometry);
        };
        Director.prototype.removeGeometry = function (name) {
            this.geometries.remove(name);
        };
        Director.prototype.getGeometry = function (name) {
            return this.geometries.get(name);
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
        /*
        createScene(sceneName: string, canvasIds: number[]) {
          //var contexts = this.contexts;
          var monitors: Canvas3D[] = canvasIds.map(function(canvasId) {
            return contexts.getWeakReference(canvasId)
          })
          var scene = new Scene(monitors)
          this.scenes.put(sceneName, scene)
          scene.release()
          var director = this
          canvasIds.forEach(function(canvasId) {
            director.addCanvasSceneLink(canvasId, sceneName)
          })
        }
        deleteScene(name: string) {
          if (this.scenes.exists(name)) {
            this.scenes.remove(name)
          }
        }
        */
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
            var slideLeaving = this.slides.getWeakRef(this.step);
            var slideEntering = this.slides.getWeakRef(this.step + 1);
            var self = this;
            var apply = function () {
                if (slideLeaving) {
                    slideLeaving.onExit(self);
                }
                slideEntering.onEnter(self);
                self.step++;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
        };
        Director.prototype.canForward = function () {
            // The last slide index is (length - 1)
            return this.step < (this.slides.length - 1);
        };
        Director.prototype.backward = function (instant, delay) {
            if (instant === void 0) { instant = true; }
            if (delay === void 0) { delay = 0; }
            if (!this.canBackward()) {
                return;
            }
            var slideLeaving = this.slides.getWeakRef(this.step);
            var slideEntering = this.slides.getWeakRef(this.step - 1);
            var self = this;
            var apply = function () {
                slideLeaving.undo(self);
                slideLeaving.onExit(self);
                if (slideEntering) {
                    slideEntering.onEnter(self);
                }
                self.step--;
            };
            if (delay) {
                setTimeout(apply, delay);
            }
            else {
                apply();
            }
        };
        Director.prototype.canBackward = function () {
            // A step value of -1 positions us just before the 1st slide.
            return this.step >= 0;
        };
        Director.prototype.pushSlide = function (slide) {
            return this.slides.push(slide);
        };
        /*
        addCanvas(canvas: HTMLCanvasElement, canvasId: number): void {
          var c3d = new Canvas3D()
          c3d.start(canvas, canvasId)
          this.contexts.put(canvasId, c3d)
          c3d.release()
        }
        */
        Director.prototype.advance = function (interval) {
            var slideIndex = this.step;
            if (slideIndex >= 0 && slideIndex < this.slides.length) {
                var slide = this.slides.get(slideIndex);
                if (slide) {
                    try {
                        slide.advance(interval);
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
        return Director;
    })(Shareable);
    return Director;
});
