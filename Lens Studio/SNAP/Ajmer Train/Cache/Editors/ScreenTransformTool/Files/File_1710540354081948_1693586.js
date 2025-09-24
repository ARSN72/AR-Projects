"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectEditor = void 0;
var RequireModule = require("RequireModule");
var __selfType = requireType("./EffectEditor");
function component(target) { target.getTypeName = function () { return __selfType; }; }
if (false) {
    require("@src/Editor/SelectionListener");
}
const _SelectionListener = RequireModule.requireModule("@src/Editor/SelectionListener");
if (false) {
    require("@src/Editor/SceneViewer");
}
const _SceneViewer = RequireModule.requireModule("@src/Editor/SceneViewer");
if (false) {
    require("@src/Editor/SCTree");
}
const _SCTree = RequireModule.requireModule("@src/Editor/SCTree");
if (false) {
    require("@lib/Utilities/LensRegion/LensRegion");
}
const _LensRegion = RequireModule.requireModule("@lib/Utilities/LensRegion/LensRegion");
if (false) {
    require("@lib/Utilities/LensRegion/PinchControl");
}
const _PinchControl = RequireModule.requireModule("@lib/Utilities/LensRegion/PinchControl");
if (false) {
    require("@lib/Utilities/LensRegion/PanControl");
}
const _PanControl = RequireModule.requireModule("@lib/Utilities/LensRegion/PanControl");
if (false) {
    require("@src/Editor/Utils");
}
const _Utils = RequireModule.requireModule("@src/Editor/Utils");
if (false) {
    require("@lib/Utilities/LensRegion/AspectControl");
}
const _AspectControl = RequireModule.requireModule("@lib/Utilities/LensRegion/AspectControl");
if (false) {
    require("@src/Editor/SceneUtils");
}
const _SceneUtils = RequireModule.requireModule("@src/Editor/SceneUtils");
if (false) {
    require("@src/Editor/Gizmo/Gizmo");
}
const _Gizmo = RequireModule.requireModule("@src/Editor/Gizmo/Gizmo");
if (false) {
    require("@src/Editor/CallScheduler");
}
const _CallScheduler = RequireModule.requireModule("@src/Editor/CallScheduler");
if (false) {
    require("@src/Editor/SelectionPicker");
}
const _SelectionPicker = RequireModule.requireModule("@src/Editor/SelectionPicker");
if (false) {
    require("@src/Editor/GizmoPool");
}
const _GizmoPool = RequireModule.requireModule("@src/Editor/GizmoPool");
if (false) {
    require("@src/Editor/AlignerHelper");
}
const _AlignerHelper = RequireModule.requireModule("@src/Editor/AlignerHelper");
if (false) {
    require("@src/Editor/LineRenderer");
}
const _LineRenderer = RequireModule.requireModule("@src/Editor/LineRenderer");
if (false) {
    require("@src/Editor/OffsetHighlight");
}
const _OffsetHighlight = RequireModule.requireModule("@src/Editor/OffsetHighlight");
if (false) {
    require("@src/Editor/Gizmo/AlignmentTypes");
}
const _AlignmentTypes = RequireModule.requireModule("@src/Editor/Gizmo/AlignmentTypes");
if (false) {
    require("@src/Editor/RulersAndGuides/GuideBars");
}
const _GuideBars = RequireModule.requireModule("@src/Editor/RulersAndGuides/GuideBars");
let EffectEditor = class EffectEditor extends BaseScriptComponent {
    setupSelectionListener() {
        this.selectionListener = new _SelectionListener.module.SelectionListener(this);
        this.selectionListener.setOnSelectionUpdate(() => {
            this.update();
        });
    }
    setupSelectionPicker() {
        this.selectionPicker = new _SelectionPicker.module.SelectionPicker(this, this.tree, this.sceneViewer.getCamera(), this.selectionListener, this.toolbar, this.gizmoPool);
    }
    setupGizmo() {
        this.gizmoPool = new _GizmoPool.module.GizmoPool(this.gizmoRef, 2, this.tree);
        this.gizmoPool.setLayer(this.sceneViewer.getLayer());
        this.gizmoPool.setInteractionCamera(this.sceneViewer.getCamera());
        this.gizmoPool.addAlignmentFunction(this.aligner.align);
        this.gizmoPool.addOnUpdateCallback((data) => {
            this.offsetHighlight.draw(this.gizmoPool.getActiveScreenTransforms(), this.gizmoPool.getActiveFijiScreenTransforms());
            this.tree.syncEditable();
        });
        this.lensRegion.getPinchControl().addOnUpdateCallback(() => {
            if (this.tree.isValidHierarchy) {
                this.updateGizmoVisualZoom();
            }
        });
        this.sceneViewer.setGizmoPool(this.gizmoPool);
    }
    updateGizmoVisualZoom() {
        this.gizmoPool.setVisualZoom(this.sceneViewer.getReferenceSize() * (1 / this.lensRegion.getPinchControl().getScale()) / 20);
    }
    update() {
        let selectedObjects = _SceneUtils.module.SceneUtils.convertObjectsToLensCore(this.selectionListener.getSelectedObject());
        if (!selectedObjects[0]) {
            this.gizmoPool.destroyActiveGizmos();
            this.sceneViewer.resetFrames();
            return;
        }
        if (_Utils.module.Utils.isEditor()) {
            this.tree.selectObjects(selectedObjects);
        }
        else {
            this.tree.selectObjects([this.testObject]);
            selectedObjects = [this.testObject];
        }
        if (!selectedObjects[0] || !this.tree.isValidHierarchy || !this.tree.validateObjects(selectedObjects)
            || !this.gizmoPool.isValid()) {
            this.toolbarObjects.forEach(obj => obj.enabled = false);
            this.clearView();
            return;
        }
        selectedObjects = this.tree.getSelectedObjects();
        this.toolbarObjects.forEach(obj => obj.enabled = true);
        if (!this.gizmoPool.isSame(selectedObjects)) {
            this.gizmoPool.createFromObjects(selectedObjects, this.tree.convertSceneObjects(selectedObjects));
        }
        this.gizmoPool.show();
        const camera = this.tree.getRoot().getComponent("Camera");
        const canvas = this.tree.getRoot().getComponent("Canvas");
        if (camera) {
            _Utils.module.Utils.forceUpdateCamera(camera);
            this.setAspectForRootCamera(camera);
            this.lensRegion.getAspectControl().setAspect(camera.aspect);
            this.sceneViewer.init(camera);
        }
        else if (canvas) {
            const size = canvas.getSize();
            this.lensRegion.getAspectControl().setAspect(size.x / size.y);
            this.setAspectForRootCanvas(canvas);
            this.sceneViewer.initFromCanvas(canvas);
        }
        else {
            return;
        }
        this.sceneViewer.updateFrames();
        this.gizmoPool.setInteractionCamera(this.sceneViewer.getCamera());
        this.gizmoPool.setLayer(this.sceneViewer.getLayer());
        this.updateSceneViewerParams();
        this.updateGizmoVisualZoom();
        this.selectionPicker.setCamera(this.sceneViewer.getCamera());
        this.selectionPicker.reset();
        this.callScheduler.scheduleCall(() => {
            this.gizmoPool.callForceUpdateForActiveGizmos();
        });
        this.aligner.reset();
    }
    clearView() {
        this.gizmoPool.hide();
        this.offsetHighlight.reset();
        this.sceneViewer.clearView();
    }
    updateSceneViewerParams() {
        if (!this.sceneViewer.isInitialized()) {
            return;
        }
        const aspectControl = this.lensRegion.getAspectControl();
        const pinchControl = this.lensRegion.getPinchControl();
        const panControl = this.lensRegion.getPanControl();
        if (_Utils.module.Utils.isEditor()) {
            panControl.forceUpdate();
        }
        const delta = panControl.getWorldDelta();
        this.sceneViewer.setScale(pinchControl.getScale(), aspectControl.getShrinkScale());
        this.sceneViewer.setDelta(delta.uniformScale(this.sceneViewer.getCamera().size / 20));
    }
    bindLensRegionToSceneViewer() {
        this.lensRegion.addOnLensRegionUpdate(() => {
            this.updateSceneViewerParams();
            if (this.tree.isValidHierarchy) {
                this.aligner.reset();
            }
        });
        if (_Utils.module.Utils.isEditor()) {
            this.lensRegion.getAspectControl().setLensStudioPreviewResolution(true);
        }
    }
    setAspectForRootCamera(camera) {
        if (camera.devicePropertyUsage !== Camera.DeviceProperty.Fov && camera.devicePropertyUsage !== Camera.DeviceProperty.None) {
            camera.devicePropertyUsage = Camera.DeviceProperty.None;
            camera.aspect = this.lensRegion.getAspectControl().getAspect();
        }
    }
    setAspectForRootCanvas(canvas) {
        const size = canvas.getSize();
        size.x = this.lensRegion.getAspectControl().getAspect() * size.x;
        // canvas.setSize(size);
    }
    getReferenceAspect() {
        if (isNull(this.tree.getRoot())) {
            return 1;
        }
        const camera = this.tree.getRoot().getComponent("Camera");
        const canvas = this.tree.getRoot().getComponent("Canvas");
        if (camera) {
            return camera.aspect;
        }
        else if (canvas) {
            const size = canvas.getSize();
            return size.x / size.y;
        }
        else {
            return 1;
        }
    }
    __initialize() {
        super.__initialize();
        this.toolbarObjects = [];
        this.onAwake = () => {
            this.callScheduler = new _CallScheduler.module.CallScheduler(this, "LateUpdateEvent");
            this.toolbar.forEach(sc => this.toolbarObjects.push(sc.getSceneObject()));
            this.setupSelectionListener();
            this.tree = new _SCTree.module.SCTree();
            this.sceneViewer.setTree(this.tree);
            this.bindLensRegionToSceneViewer();
            this.aligner = new _AlignerHelper.module.AlignerHelper(this.tree, this.sceneViewer.getCamera(), this.pinLineRenderer, this.guides);
            this.offsetHighlight = new _OffsetHighlight.module.OffsetHighlight(this.offsetLineRenderer, this.sceneViewer.getCamera());
            this.setupGizmo();
            this.setupSelectionPicker();
            if (!_Utils.module.Utils.isEditor()) {
                this.update();
            }
            this.createEvent("UpdateEvent").bind(() => {
                this.sceneViewer.resetZPosition();
                if (!this.tree.reassureValidPath()) {
                    this.gizmoPool.destroyActiveGizmos();
                    this.update();
                    return;
                }
                if (this.gizmoPool.isValid()) {
                    this.gizmoPool.updateActiveGizmos();
                    this.offsetHighlight.draw(this.gizmoPool.getActiveScreenTransforms(), this.gizmoPool.getActiveFijiScreenTransforms());
                }
                if (this.sceneViewer.checkForReferenceDiff()) {
                    this.update();
                    return;
                }
            });
        };
    }
};
EffectEditor = __decorate([
    component
], EffectEditor);
exports.EffectEditor = EffectEditor;
