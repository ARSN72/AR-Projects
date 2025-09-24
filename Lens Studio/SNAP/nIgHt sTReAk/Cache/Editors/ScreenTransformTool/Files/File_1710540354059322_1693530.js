"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidePoint = exports.TouchEventType = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/Gizmo/Points/Point");
}
const _Point = RequireModule.requireModule("@src/Editor/Gizmo/Points/Point");
if (false) {
    require("@src/Editor/Gizmo/Gizmo");
}
const _Gizmo = RequireModule.requireModule("@src/Editor/Gizmo/Gizmo");
if (false) {
    require("@lib/Utilities/LensRegion/LensRegion");
}
const _LensRegion = RequireModule.requireModule("@lib/Utilities/LensRegion/LensRegion");
var TouchEventType;
(function (TouchEventType) {
    TouchEventType[TouchEventType["STARTED"] = 0] = "STARTED";
    TouchEventType[TouchEventType["CHANGED"] = 1] = "CHANGED";
    TouchEventType[TouchEventType["ENDED"] = 2] = "ENDED";
})(TouchEventType = exports.TouchEventType || (exports.TouchEventType = {}));
class SidePoint extends _Point.module.Point {
    constructor(sceneObject) {
        super(sceneObject);
    }
    setupInteractions() {
        let worldOffset = vec3.zero();
        let interactionStarted = false;
        let touchMoveRegistry = null;
        const processTouch = (eventData, touchEventType) => {
            this.callback && this.callback({
                screenPosition: eventData.position,
                sidePointOffset: this.offset,
                worldPosition: translatedTouchPosition(eventData).sub(worldOffset),
                touchEventType: touchEventType
            });
        };
        const translatedTouchPosition = (eventData) => {
            return this.interactionCamera.screenSpaceToWorldSpace(eventData.position, -1);
        };
        const onTouchStart = (eventData) => {
            if (_LensRegion.module.LensRegion.isBusy) {
                return;
            }
            interactionStarted = true;
            if (this.validator && this.validator()) {
                const sidePointWorldPosition = this.screenTransform.localPointToWorldPoint(vec2.zero());
                worldOffset = translatedTouchPosition(eventData).sub(sidePointWorldPosition);
            }
            _Gizmo.module.Gizmo.isBusy = true;
            processTouch(eventData, TouchEventType.STARTED);
            // Because touchMove is triggered at the same time as touchStart, and it is wrong even when there's no movement.
            touchMoveRegistry = this.interactionComponent.onTouchMove.add(onTouchMove);
        };
        const onTouchMove = (eventData) => {
            if (!interactionStarted) {
                return;
            }
            processTouch(eventData, TouchEventType.CHANGED);
        };
        const onTouchEnd = (eventData) => {
            if (!interactionStarted) {
                return;
            }
            interactionStarted = false;
            processTouch(eventData, TouchEventType.ENDED);
            this.interactionComponent.onTouchMove.remove(touchMoveRegistry);
            _Gizmo.module.Gizmo.isBusy = false;
        };
        this.interactionComponent.onTouchStart.add(onTouchStart);
        // this.interactionComponent.onTouchMove.add(onTouchMove);
        this.interactionComponent.onTouchEnd.add(onTouchEnd);
    }
}
exports.SidePoint = SidePoint;
