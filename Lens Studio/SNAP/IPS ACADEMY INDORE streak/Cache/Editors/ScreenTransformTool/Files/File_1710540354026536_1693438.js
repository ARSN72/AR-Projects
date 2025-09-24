"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Isolate = void 0;
var RequireModule = require("RequireModule");
var __selfType = requireType("./Isolate");
function component(target) { target.getTypeName = function () { return __selfType; }; }
if (false) {
    require("@src/Editor/Tools/Button");
}
const _Button = RequireModule.requireModule("@src/Editor/Tools/Button");
if (false) {
    require("@src/Editor/Config");
}
const _Config = RequireModule.requireModule("@src/Editor/Config");
if (false) {
    require("@src/Editor/MouseHint");
}
const _MouseHint = RequireModule.requireModule("@src/Editor/MouseHint");
let Isolate = class Isolate extends BaseScriptComponent {
    setupButton() {
        this.button = new _Button.module.Button(this.sceneObject, this.camera, null, true, () => {
            _Config.module.Config.isIsolated.value = !_Config.module.Config.isIsolated.value;
            this.material.mainPass.Active = _Config.module.Config.isIsolated.value;
        }, (isHovered) => {
            this.hint.updateFromTargetScreenTransform(this.screenTransform);
            if (isHovered) {
                this.hint.setRoundness(0);
                this.hint.enableStroke(true);
                this.hint.setText("Isolate");
                this.hint.show();
            }
            else {
                this.hint.hide();
            }
        });
    }
    __initialize() {
        super.__initialize();
        this.onAwake = () => {
            this.sceneObject = this.getSceneObject();
            this.screenTransform = this.sceneObject.getComponent("ScreenTransform");
            this.material = this.sceneObject.getComponent("Image").mainMaterial;
            this.setupButton();
        };
    }
};
Isolate = __decorate([
    component
], Isolate);
exports.Isolate = Isolate;
