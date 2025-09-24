"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotationPoint = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/Gizmo/Points/SidePoint");
}
const _SidePoint = RequireModule.requireModule("@src/Editor/Gizmo/Points/SidePoint");
class RotationPoint extends _SidePoint.module.SidePoint {
    constructor(sceneObject) {
        super(sceneObject);
    }
}
exports.RotationPoint = RotationPoint;
