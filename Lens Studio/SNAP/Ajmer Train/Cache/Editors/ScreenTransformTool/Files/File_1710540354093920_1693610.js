"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionPicker = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/SCTree");
}
const _SCTree = RequireModule.requireModule("@src/Editor/SCTree");
if (false) {
    require("@src/Editor/Gizmo/Gizmo");
}
const _Gizmo = RequireModule.requireModule("@src/Editor/Gizmo/Gizmo");
if (false) {
    require("@lib/Utilities/LensRegion/LensRegion");
}
const _LensRegion = RequireModule.requireModule("@lib/Utilities/LensRegion/LensRegion");
if (false) {
    require("@src/Editor/SelectionListener");
}
const _SelectionListener = RequireModule.requireModule("@src/Editor/SelectionListener");
if (false) {
    require("@src/Editor/Utils");
}
const _Utils = RequireModule.requireModule("@src/Editor/Utils");
if (false) {
    require("@src/Editor/KeyboardListener");
}
const _KeyboardListener = RequireModule.requireModule("@src/Editor/KeyboardListener");
if (false) {
    require("@src/Editor/GizmoPool");
}
const _GizmoPool = RequireModule.requireModule("@src/Editor/GizmoPool");
if (false) {
    require("@src/Editor/Gizmo/GizmoUtils");
}
const _GizmoUtils = RequireModule.requireModule("@src/Editor/Gizmo/GizmoUtils");
class SelectionPicker {
    constructor(script, tree, camera, selectionListener, excludeObjects, gizmoPool) {
        this.script = script;
        this.tree = tree;
        this.camera = camera;
        this.selectionListener = selectionListener;
        this.excludeObjects = excludeObjects;
        this.gizmoPool = gizmoPool;
        this.objects = [];
        this.screenTransforms = [];
        this.reset();
        this.setupInteractions();
    }
    reset() {
        this.objects = this.tree.collectObjects();
        this.screenTransforms = [];
        this.objects.forEach(obj => {
            const component = obj.getComponent("ScreenTransform");
            const region = obj.getComponent("ScreenRegionComponent");
            if (component && !region) {
                this.screenTransforms.push(component);
            }
        });
    }
    setCamera(camera) {
        this.camera = camera;
    }
    updateSelection(sceneObject) {
        if (!_Utils.module.Utils.isEditor()) {
            this.tree.selectObjects([sceneObject]);
            return;
        }
        if (!sceneObject) {
            Editor.context.selection.clear();
            return;
        }
        const fijiSceneObject = this.tree.convertSceneObject(sceneObject);
        if (!fijiSceneObject) {
            //SceneUtils.printHierarchyFromRoot(sceneObject);
        }
        Editor.context.selection.set([fijiSceneObject]);
    }
    addOrRemoveSelectedObject(sceneObject) {
        if (!sceneObject) {
            return;
        }
        const fijiSceneObject = this.tree.convertSceneObject(sceneObject);
        if (!fijiSceneObject) {
            return;
        }
        const selection = Editor.context.selection.sceneObjects;
        let findIndex = -1;
        selection.forEach((obj, idx) => {
            if (obj.id.toString() === fijiSceneObject.id.toString()) {
                findIndex = idx;
            }
        });
        if (findIndex !== -1) {
            selection.splice(findIndex, 1);
        }
        else {
            selection.push(fijiSceneObject);
        }
        Editor.context.selection.set(selection);
    }
    getTouchedScreenTransform(screenPosition, ignoreGizmo = false) {
        // if (isNull(this.gizmo) || isNull(this.gizmo.getEditableScreenTransform())) {
        //     this.gizmo = null;
        // }
        const refCamera = isNull(this.tree.getRoot()) ? null : this.tree.getRoot().getComponent("Camera");
        if (refCamera) {
            screenPosition = _GizmoUtils.module.GizmoUtils.screenPointToScreenPoint(screenPosition, this.camera, refCamera);
        }
        if (!ignoreGizmo) {
            const screenTransform = this.gizmoPool.getScreenTransformByScreenPoint(screenPosition);
            if (screenTransform) {
                return screenTransform;
            }
        }
        const gizmo = this.gizmoPool.size() ? this.gizmoPool.getActiveGizmos()[0] : null;
        let closestPosition = 0;
        let closesScreenTransform = null;
        let isChild = false;
        this.screenTransforms.forEach((screenTransform, idx) => {
            if (isNull(screenTransform) || isNull(screenTransform.getSceneObject()) || !screenTransform.containsScreenPoint(screenPosition) ||
                ((gizmo === null || gizmo === void 0 ? void 0 : gizmo.isVisible()) &&
                    screenTransform.uniqueIdentifier === (gizmo === null || gizmo === void 0 ? void 0 : gizmo.getEditableScreenTransform().uniqueIdentifier))) {
                return;
            }
            const pos = screenTransform.getTransform().getWorldPosition().z;
            if (!closesScreenTransform || closestPosition > pos || (closestPosition === pos && !isChild)) {
                closestPosition = pos;
                closesScreenTransform = screenTransform;
                if (gizmo && !isNull(gizmo.getEditableScreenTransform())) {
                    isChild = this.tree.isInHierarchy(gizmo.getEditableScreenTransform().getSceneObject(), screenTransform.getSceneObject());
                }
            }
        });
        return closesScreenTransform;
    }
    valid() {
        try {
            for (let i = 0; i < this.screenTransforms.length; i++) {
                if (isNull(this.screenTransforms[i]) || isNull(this.screenTransforms[i].getSceneObject())) {
                    return false;
                }
            }
        }
        catch (e) {
            return false;
        }
        return true;
    }
    setupInteractions() {
        this.script.updatePriority = this.script.updatePriority - 1;
        const touchStartEvent = this.script.createEvent("TouchStartEvent");
        const touchMoveEvent = this.script.createEvent("TouchMoveEvent");
        const touchEndEvent = this.script.createEvent("TouchEndEvent");
        const onTouchStart = (eventData) => {
            if (_LensRegion.module.LensRegion.isBusy || _Gizmo.module.Gizmo.isBusy
                || this.excludeObjects.some(obj => obj.containsScreenPoint(eventData.getTouchPosition()))) {
                return;
            }
            if (!this.valid()) {
                this.selectionListener.forceCallSelectionUpdate();
                this.reset();
                return;
            }
            this.selectionListener.forceUpdate();
            const closestScreenTransform = this.getTouchedScreenTransform(eventData.getTouchPosition());
            if (closestScreenTransform) {
                if (_KeyboardListener.module.KeyboardListener.isKeyPressed(Keys.Key_Control)) {
                    this.addOrRemoveSelectedObject(closestScreenTransform.getSceneObject());
                    return;
                }
                const isNewObjectPicked = !this.gizmoPool.has(closestScreenTransform);
                if (isNewObjectPicked) {
                    this.updateSelection(closestScreenTransform.getSceneObject());
                    return;
                }
            }
            else {
                this.updateSelection(null);
                return;
            }
            touchMoveEvent.enabled = true;
            touchEndEvent.enabled = true;
        };
        const onTouchMove = (eventData) => {
            touchMoveEvent.enabled = false;
            touchEndEvent.enabled = false;
        };
        const onTouchEnd = (eventData) => {
            const closestScreenTransform = this.getTouchedScreenTransform(eventData.getTouchPosition(), this.gizmoPool.size() < 2);
            if (closestScreenTransform) {
                this.updateSelection(closestScreenTransform.getSceneObject());
            }
            touchMoveEvent.enabled = false;
            touchEndEvent.enabled = false;
        };
        touchStartEvent.bind(onTouchStart);
        touchMoveEvent.bind(onTouchMove);
        touchEndEvent.bind(onTouchEnd);
        touchMoveEvent.enabled = false;
        touchEndEvent.enabled = false;
    }
}
exports.SelectionPicker = SelectionPicker;
