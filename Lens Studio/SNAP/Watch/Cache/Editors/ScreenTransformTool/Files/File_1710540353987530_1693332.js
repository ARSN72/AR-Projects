"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = void 0;
var RequireModule = require("RequireModule");
var __selfType = requireType("./Cursor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
if (false) {
    require("@src/Editor/MouseCursor/CursorData");
}
const _CursorData = RequireModule.requireModule("@src/Editor/MouseCursor/CursorData");
if (false) {
    require("@src/Editor/MouseCursor/CursorModule");
}
const _CursorModule = RequireModule.requireModule("@src/Editor/MouseCursor/CursorModule");
if (false) {
    require("@src/Editor/MouseCursor/CursorUtils");
}
const _CursorUtils = RequireModule.requireModule("@src/Editor/MouseCursor/CursorUtils");
if (false) {
    require("@src/Editor/Gizmo/GizmoUtils");
}
const _GizmoUtils = RequireModule.requireModule("@src/Editor/Gizmo/GizmoUtils");
if (false) {
    require("@src/Editor/MouseCursor/CursorIcons");
}
const _CursorIcons = RequireModule.requireModule("@src/Editor/MouseCursor/CursorIcons");
let Cursor = class Cursor extends BaseScriptComponent {
    // In radians
    setRotation(angle) {
        this.rotation = angle * 180 / Math.PI;
        this.tryUpdateCursor();
    }
    setCursorType(cursorType) {
        this.cursorType = cursorType;
        this.tryUpdateCursor();
    }
    tryUpdateCursor() {
        _CursorModule.module.setCursorTexture(this.id, this.prepareTexture());
    }
    getTexture() {
        if (this.cursorType === _CursorData.module.CursorType.Custom) {
            return this.cursorTexture;
        }
        if (global.deviceInfoSystem.getOS() === OS.MacOS) {
            return _CursorIcons.module.CursorIcons.macIconTextures[Math.round(this.cursorType)];
        }
        if (global.deviceInfoSystem.getOS() === OS.Windows) {
            return _CursorIcons.module.CursorIcons.winIconTextures[Math.round(this.cursorType)];
        }
        throw new Error("Your OS isn't supported");
    }
    prepareTexture() {
        this.cropTextureProvider.inputTexture = this.getTexture();
        if (this.rotationType === _CursorData.module.RotationType.Custom) {
            this.cropTextureProvider.rotation = _CursorUtils.module.CursorUtils.degToRad(this.rotation);
        }
        else if (this.rotationType === _CursorData.module.RotationType.LockToWorldRotation) {
            this.cropTextureProvider.rotation = this.transform.getWorldRotation().toEulerAngles().z + _CursorUtils.module.CursorUtils.degToRad(this.rotationOffset);
        }
        else {
            this.cropTextureProvider.rotation = this.getObjectRotation() + _CursorUtils.module.CursorUtils.degToRad(this.rotationObjectOffset);
        }
        return this.cropTexture;
    }
    getObjectRotation() {
        const centerPos = this.rotationObjectScreenTransform.localPointToScreenPoint(vec2.zero());
        const cursorPos = _GizmoUtils.module.GizmoUtils.worldPointToScreenPoint(this.rotationObjectScreenTransform, this.transform.getWorldPosition());
        return this.getAngleBetweenVectors(vec2.right(), cursorPos.sub(centerPos).normalize());
    }
    getAngleBetweenVectors(vector1, vector2) {
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
        const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
        const cosTheta = dotProduct / (magnitude1 * magnitude2);
        let radians = Math.acos(cosTheta);
        const sign = Math.sign(crossProduct);
        radians = sign * radians;
        if (radians < 0) {
            radians += 2 * Math.PI;
        }
        return -radians;
    }
    setupTriggers() {
        const interactionComponent = this.getSceneObject().getComponent("InteractionComponent");
        const onStart = () => {
            _CursorModule.module.setCursorTexture(this.id, this.prepareTexture());
        };
        const onChange = () => {
            const texture = this.prepareTexture(); // need to do this before 'if' to have updated rotation
            if (this.cropTextureProvider.rotation !== _CursorModule.module.lastRotation) {
                _CursorModule.module.setCursorTexture(this.id, texture);
            }
        };
        const onEnd = () => {
            _CursorModule.module.resetCursorTexture(this.id);
        };
        this.createEvent("OnDestroyEvent").bind(onEnd);
        if (!_CursorUtils.module.CursorUtils.isEditor()) {
            if (interactionComponent) {
                interactionComponent.onTouchStart.add(onStart);
                interactionComponent.onTouchMove.add(onChange);
                interactionComponent.onTouchEnd.add(onEnd);
            }
            else {
                this.createEvent("TouchStartEvent").bind(onStart);
                this.createEvent("TouchMoveEvent").bind(onChange);
                this.createEvent("TouchEndEvent").bind(onEnd);
            }
            return;
        }
        switch (this.triggerType) {
            case _CursorData.module.TriggerType.onTouch:
                if (interactionComponent) {
                    interactionComponent.onTouchStart.add(onStart);
                    interactionComponent.onTouchMove.add(onChange);
                    interactionComponent.onTouchEnd.add(onEnd);
                }
                else {
                    this.createEvent("TouchStartEvent").bind(onStart);
                    this.createEvent("TouchMoveEvent").bind(onChange);
                    this.createEvent("TouchEndEvent").bind(onEnd);
                }
                break;
            case _CursorData.module.TriggerType.onHover:
                if (interactionComponent) {
                    interactionComponent.onHoverStart.add(onStart);
                    interactionComponent.onTouchMove.add(onChange); // There are no hover move events when touch is active
                    interactionComponent.onHover.add(onChange);
                    interactionComponent.onTouchEnd.add(onEnd);
                    interactionComponent.onHoverEnd.add(onEnd);
                }
                else {
                    this.createEvent("HoverStartEvent").bind(onStart);
                    this.createEvent("TouchMoveEvent").bind(onChange); // There are no hover move events when touch is active
                    this.createEvent("HoverEvent").bind(onChange);
                    this.createEvent("TouchEndEvent").bind(onEnd);
                    this.createEvent("HoverEndEvent").bind(onEnd);
                }
                break;
            case _CursorData.module.TriggerType.onPan:
                if (interactionComponent) {
                    interactionComponent.onPanStart.add(onStart);
                    interactionComponent.onPanMove.add(onChange);
                    interactionComponent.onPanEnd.add(onEnd);
                }
                else {
                    this.createEvent("PanGestureStartEvent").bind(onStart);
                    this.createEvent("PanGestureMoveEvent").bind(onChange);
                    this.createEvent("PanGestureEndEvent").bind(onEnd);
                }
                break;
            case _CursorData.module.TriggerType.onPinch:
                if (interactionComponent) {
                    interactionComponent.onPinchStart.add(onStart);
                    interactionComponent.onPinchMove.add(onChange);
                    interactionComponent.onPinchEnd.add(onEnd);
                }
                else {
                    this.createEvent("PinchGestureStartEvent").bind(onStart);
                    this.createEvent("PinchGestureMoveEvent").bind(onChange);
                    this.createEvent("PinchGestureEndEvent").bind(onEnd);
                }
                break;
            default:
                throw new Error("Trigger type not implemented");
        }
    }
    createCropTexture() {
        this.cropTexture = global.assetSystem.createAsset("Asset.Texture");
        this.cropTexture.control = global.scene.createResourceProvider("Provider.RectCropTextureProvider");
        this.cropTextureProvider = this.cropTexture.control;
    }
    __initialize() {
        super.__initialize();
        this.onAwake = () => {
            var _a;
            this.transform = this.getTransform();
            this.rotationObjectScreenTransform = (_a = this.rotationObject) === null || _a === void 0 ? void 0 : _a.getComponent("ScreenTransform");
            this.id = this.uniqueIdentifier;
            this.createCropTexture();
            this.setupTriggers();
        };
    }
};
Cursor = __decorate([
    component
], Cursor);
exports.Cursor = Cursor;
