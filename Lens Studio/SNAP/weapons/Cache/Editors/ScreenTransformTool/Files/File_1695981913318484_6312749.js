"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LensRegion = void 0;
var RequireModule = require("RequireModule");
var __selfType = requireType("./LensRegion");
function component(target) { target.getTypeName = function () { return __selfType; }; }
if (false) {
    require("./AspectControl");
}
const _AspectControl = RequireModule.requireModule("./AspectControl");
if (false) {
    require("./PanControl");
}
const _PanControl = RequireModule.requireModule("./PanControl");
if (false) {
    require("./PinchControl");
}
const _PinchControl = RequireModule.requireModule("./PinchControl");
let LensRegion = class LensRegion extends BaseScriptComponent {
    addOnLensRegionUpdate(cb) {
        this.aspectControl.addOnUpdateCallback(cb);
        this.panControl.addOnUpdateCallback(cb);
        this.pinchControl.addOnUpdateCallback(cb);
    }
    updateBackgroundResolution(texture) {
        this.aspectControl.updateLensResolution(texture);
    }
    getAspectControl() {
        return this.aspectControl;
    }
    getPanControl() {
        return this.panControl;
    }
    getPinchControl() {
        return this.pinchControl;
    }
    getWindowTexture() {
        return this.windowResolution;
    }
    reset() {
        this.panControl.resetPosition();
        this.pinchControl.resetScale();
    }
    resetScale() {
        this.pinchControl.resetScale();
    }
    resetPosition() {
        this.panControl.resetPosition();
    }
    __initialize() {
        super.__initialize();
        this.onAwake = () => {
            this.screenTransform = this.getSceneObject().getComponent("ScreenTransform");
            this.aspectControl = new _AspectControl.module.AspectControl(this, this.windowResolution, this.lensResolution, this.screenTransform);
            this.panControl = new _PanControl.module.PanControl(this, this.screenTransform);
            this.pinchControl = new _PinchControl.module.PinchControl(this, this.screenTransform, this.panControl);
        };
    }
};
LensRegion.isBusy = false;
LensRegion = __decorate([
    component
], LensRegion);
exports.LensRegion = LensRegion;
