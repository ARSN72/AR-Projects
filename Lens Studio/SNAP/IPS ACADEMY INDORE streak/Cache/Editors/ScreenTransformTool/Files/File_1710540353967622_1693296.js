"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var RequireModule = require("RequireModule");
var __selfType = requireType("./Main");
function component(target) { target.getTypeName = function () { return __selfType; }; }
if (false) {
    require("@lib/Utilities/LensRegion/LensRegion");
}
const _LensRegion = RequireModule.requireModule("@lib/Utilities/LensRegion/LensRegion");
if (false) {
    require("@lib/Utilities/RenderLayerUtils");
}
const _RenderLayerUtils = RequireModule.requireModule("@lib/Utilities/RenderLayerUtils");
if (false) {
    require("../../Common/Utilities/LensRegion/PanControl");
}
const _PanControl = RequireModule.requireModule("../../Common/Utilities/LensRegion/PanControl");
if (false) {
    require("@src/Editor/Gizmo/GizmoUtils");
}
const _GizmoUtils = RequireModule.requireModule("@src/Editor/Gizmo/GizmoUtils");
let Main = class Main extends BaseScriptComponent {
    onAwake() {
        _RenderLayerUtils.module.RenderLayerUtils.setUniqueLayersForHierarchy(this.getSceneObject().getParent());
        this.panControl = this.lensRegion.getPanControl();
        _GizmoUtils.module.GizmoUtils.aspectSource = this.lensRegion.getWindowTexture();
    }
    getLensRegion() {
        return this.lensRegion;
    }
};
Main = __decorate([
    component
], Main);
exports.Main = Main;
