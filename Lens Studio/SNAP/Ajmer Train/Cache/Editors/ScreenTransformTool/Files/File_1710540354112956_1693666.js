"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCTree = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/ObjectConverter");
}
const _ObjectConverter = RequireModule.requireModule("@src/Editor/ObjectConverter");
if (false) {
    require("@src/Editor/SceneUtils");
}
const _SceneUtils = RequireModule.requireModule("@src/Editor/SceneUtils");
if (false) {
    require("@src/Editor/Utils");
}
const _Utils = RequireModule.requireModule("@src/Editor/Utils");
if (false) {
    require("@src/Editor/TraverseHelper");
}
const _TraverseHelper = RequireModule.requireModule("@src/Editor/TraverseHelper");
class SCTree {
    constructor() {
        this.root = null;
        this.selectedObjects = [null];
        this.objectConverter = new _ObjectConverter.module.ObjectConverter();
        this.traverseHelper = new _TraverseHelper.module.TraverseHelper();
        this.selectedScreenTransforms = [];
        this.selectedFijiScreenTransforms = [];
        this.isValidHierarchy = false;
    }
    selectObjects(objects) {
        this.selectedObjects = objects;
        if (!this.tryInitRootObject(objects)) {
            this.isValidHierarchy = false;
            return;
        }
        this.selectedObjects = this.selectedObjects.filter((obj) => obj.getComponent("ScreenTransform"));
        // if (!this.selectedObjects.length) {
        //     this.selectedObjects = [null];
        // }
        this.isValidHierarchy = true;
        this.objectConverter.reset();
        this.init();
    }
    /* Check if the path from root camera/canvas to selected object is still valid */
    reassureValidPath() {
        if (!this.isValidHierarchy) {
            return false;
        }
        if (this.selectedObjects.some(obj => isNull(obj)) || isNull(this.root) || this.selectedObjects.some(obj => !obj.hasParent())) {
            this.isValidHierarchy = false;
            return false;
        }
        for (let i = 0; i < this.selectedObjects.length; i++) {
            let validPath = false;
            let parent = this.selectedObjects[i];
            do {
                parent = parent.getParent();
                if (parent.uniqueIdentifier === this.root.uniqueIdentifier) {
                    validPath = true;
                    break;
                }
            } while (parent.hasParent());
            if (!validPath) {
                this.isValidHierarchy = false;
                return false;
            }
        }
        return true;
    }
    validateObjects(objects) {
        for (let i = 0; i < objects.length; i++) {
            if (!this.objectConverter.hasLensCoreObject(objects[i])) {
                return false;
            }
        }
        return true;
    }
    getRoot() {
        return this.root;
    }
    getSelectedObjects() {
        return this.selectedObjects;
    }
    collectObjects() {
        if (!this.isValidHierarchy) {
            return [];
        }
        const rule = (sceneObject) => {
            var _a;
            return !isNull(sceneObject)
                && ((_a = sceneObject.getComponent("ScreenTransform")) === null || _a === void 0 ? void 0 : _a.isInScreenHierarchy())
                && !sceneObject.layer.contains(_Utils.module.Utils.SYSTEM_LAYER)
                && sceneObject.isEnabledInHierarchy;
        };
        return this.objectConverter.collectLensCoreObjects(rule);
    }
    collectObjectsForAlignment() {
        if (!this.isValidHierarchy) {
            return [];
        }
        const rule = (sceneObject) => {
            const screenTransform = sceneObject.getComponent("ScreenTransform");
            return this.traverseHelper.isInHierarchy(this.root, sceneObject)
                && !this.selectedObjects.some(obj => this.traverseHelper.isInHierarchy(obj, sceneObject))
                && !sceneObject.layer.contains(_Utils.module.Utils.SYSTEM_LAYER)
                && screenTransform && screenTransform.isInScreenHierarchy() && sceneObject.isEnabledInHierarchy;
        };
        return this.objectConverter.collectLensCoreObjects(rule);
    }
    syncEditable() {
        if (this.selectedScreenTransforms.some(obj => isNull(obj)) || this.selectedFijiScreenTransforms.some(obj => isNull(obj))
            || !this.isValidHierarchy || !_Utils.module.Utils.isEditor()) {
            return;
        }
        for (let i = 0; i < this.selectedScreenTransforms.length; i++) {
            this.syncScreenTransforms(this.selectedScreenTransforms[i], this.selectedFijiScreenTransforms[i]);
        }
    }
    convertSceneObject(sceneObject) {
        return this.objectConverter.convertToLensStudioObject(sceneObject);
    }
    convertSceneObjects(sceneObjects) {
        return sceneObjects.map((obj) => {
            return this.objectConverter.convertToLensStudioObject(obj);
        });
    }
    isInHierarchy(objA, objB) {
        if (!objA || !objB) {
            return false;
        }
        return this.traverseHelper.isInHierarchy(objA, objB);
    }
    syncScreenTransforms(src, dst) {
        const fijiTransform = dst.transform;
        fijiTransform.rotation = src.rotation.toEulerAngles().uniformScale(180 / Math.PI);
        // fijiTransform.position = src.position;
        dst.transform = fijiTransform;
        dst.pivot = src.pivot;
        dst.offset = this.syncRect(src.offsets, dst.offset);
        dst.anchor = this.syncRect(src.anchors, dst.anchor);
        // print("POSITION SET FROM: " + fijiTransform.position + " TO: " + src.position);
    }
    syncRect(src, dst) {
        dst.top = src.top;
        dst.left = src.left;
        dst.right = src.right;
        dst.bottom = src.bottom;
        return dst;
    }
    tryInitRootObject(objects) {
        let isValid = true;
        const rootObjects = objects.map(obj => this.validate(obj, true));
        rootObjects.forEach(obj => {
            if (obj !== rootObjects[0]) {
                isValid = false;
            }
        });
        if (!rootObjects[0]) {
            isValid = false;
        }
        if (isValid) {
            this.root = rootObjects[0];
        }
        return isValid;
    }
    init() {
        this.updateObjectConverter(this.root);
        this.traverseHelper.setRoot(this.root);
        this.selectedScreenTransforms = [];
        this.selectedFijiScreenTransforms = [];
        this.selectedObjects.forEach((object) => {
            this.selectedScreenTransforms.push(object.getComponent("ScreenTransform"));
            this.selectedFijiScreenTransforms.push(this.objectConverter.convertToLensStudioObject(object).getComponent("ScreenTransform"));
        });
    }
    updateObjectConverter(root) {
        // if (this.objectConverter.hasLensCoreObject(root)) {
        //     return;
        // }
        this.objectConverter.addLensCoreHierarchy(root);
        if (_Utils.module.Utils.isEditor()) {
            this.objectConverter.addLensStudioHierarchy(_SceneUtils.module.SceneUtils.findObjectInLensStudio(root));
        }
    }
    validate(sceneObject, isSelectedObject = true) {
        if (!sceneObject /*|| !sceneObject.enabled*/) {
            return null;
        }
        const camera = sceneObject.getComponent("Camera");
        if ( /*!isSelectedObject &&*/camera && camera.enabled) {
            if (camera.type !== Camera.Type.Orthographic) {
                return null;
            }
            return sceneObject;
        }
        const canvas = sceneObject.getComponent("Canvas");
        if ( /*!isSelectedObject &&*/canvas && canvas.enabled) {
            return sceneObject;
        }
        const screenTransform = sceneObject.getComponent("ScreenTransform");
        if (!screenTransform || !screenTransform.enabled) {
            return null;
        }
        if (!sceneObject.hasParent()) {
            return null;
        }
        return this.validate(sceneObject.getParent(), false);
    }
}
exports.SCTree = SCTree;
