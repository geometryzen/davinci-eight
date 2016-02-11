var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../slideshow/Slide', '../collections/ShareableArray', '../core/Shareable'], function (require, exports, Slide_1, ShareableArray_1, Shareable_1) {
    var Director = (function (_super) {
        __extends(Director, _super);
        function Director() {
            _super.call(this, 'Director');
            this.step = -1;
            this.slides = new ShareableArray_1.default([]);
            this.facets = {};
        }
        Director.prototype.destructor = function () {
            this.slides.release();
            this.slides = void 0;
            this.facets = void 0;
        };
        Director.prototype.addFacet = function (facet, facetName) {
            this.facets[facetName] = facet;
        };
        Director.prototype.getFacet = function (facetName) {
            return this.facets[facetName];
        };
        Director.prototype.removeFacet = function (facetName) {
            var facet = this.getFacet(facetName);
            delete this.facets[facetName];
            return facet;
        };
        Director.prototype.createSlide = function () {
            return new Slide_1.default();
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
                    slideLeaving.doEpilog(self, true);
                }
                if (slideEntering) {
                    slideEntering.doProlog(self, true);
                }
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
            return this.step < this.slides.length;
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
                if (slideLeaving) {
                    slideLeaving.undo(self);
                    slideLeaving.doProlog(self, false);
                }
                if (slideEntering) {
                    slideEntering.doEpilog(self, false);
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
            return this.step > -1;
        };
        Director.prototype.pushSlide = function (slide) {
            return this.slides.push(slide);
        };
        Director.prototype.popSlide = function (slide) {
            return this.slides.pop();
        };
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
                    console.warn("No slide found at index " + this.step);
                }
            }
        };
        return Director;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Director;
});
