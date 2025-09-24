"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorsFrame = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/Gizmo/Points/AnchorPoint");
}
const _AnchorPoint = RequireModule.requireModule("@src/Editor/Gizmo/Points/AnchorPoint");
if (false) {
    require("@src/Editor/Gizmo/FrameSide");
}
const _FrameSide = RequireModule.requireModule("@src/Editor/Gizmo/FrameSide");
if (false) {
    require("@src/Editor/Gizmo/GizmoUtils");
}
const _GizmoUtils = RequireModule.requireModule("@src/Editor/Gizmo/GizmoUtils");
class AnchorsFrame {
    constructor(screenTransform, frameSide, anchorPoints) {
        this.screenTransform = screenTransform;
        this.frameSide = frameSide;
        this.anchorPoints = anchorPoints;
        this.offsets = screenTransform.offsets;
        this.anchors = screenTransform.anchors;
        this.baseScreenTransform = screenTransform.getSceneObject().getParent().getComponent("ScreenTransform");
    }
    setVisualZoom(zoom) {
        this.anchorPoints.forEach(point => point.setZoom(zoom));
        this.frameSide.forEach(frame => frame.setVisualZoom(zoom));
    }
    setVisualScale(scale) {
        // this.anchorPoints.forEach(point => point.setScale(scale));
        // this.frameSide.forEach(frame => frame.setVisualScale(scale.x, scale.y))
    }
    updateLayer(layer) {
        this.frameSide.forEach(frame => frame.updateLayer(layer));
    }
    updateTransform(rootScreenTransform) {
        const worldAnchorCenter = _GizmoUtils.module.GizmoUtils.parentPointToWorldPoint(rootScreenTransform, rootScreenTransform.anchors.getCenter());
        const inverseScale = rootScreenTransform.scale;
        inverseScale.x = 1 / inverseScale.x;
        inverseScale.y = 1 / inverseScale.y;
        inverseScale.z = 1 / inverseScale.z;
        this.baseScreenTransform.scale = inverseScale;
        this.screenTransform.rotation = rootScreenTransform.rotation.invert();
        this.offsets.left = -rootScreenTransform.offsets.left;
        this.offsets.right = -rootScreenTransform.offsets.right;
        this.offsets.top = -rootScreenTransform.offsets.top;
        this.offsets.bottom = -rootScreenTransform.offsets.bottom;
        this.offsets.setCenter(vec2.zero());
        this.anchors.setCenter(this.screenTransform.worldPointToParentPoint(worldAnchorCenter));
    }
}
exports.AnchorsFrame = AnchorsFrame;
