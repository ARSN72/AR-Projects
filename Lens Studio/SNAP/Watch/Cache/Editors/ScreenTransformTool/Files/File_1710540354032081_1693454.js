"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectConverter = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/Utils");
}
const _Utils = RequireModule.requireModule("@src/Editor/Utils");
if (false) {
    require("@src/Editor/Gizmo/GizmoUtils");
}
const _GizmoUtils = RequireModule.requireModule("@src/Editor/Gizmo/GizmoUtils");
class ObjectConverter {
    constructor() {
        this.uuidToObj = {}; // LensStudio
        this.uniqueIdentifierToObj = {}; // LensCore
    }
    hasLensCoreObject(sceneObject) {
        return !!this.uniqueIdentifierToObj[sceneObject.uniqueIdentifier];
    }
    hasLensStudioObject(sceneObject) {
        return !!this.uuidToObj[sceneObject.id.toString()];
    }
    addUUID(sceneObject) {
        this.uuidToObj[sceneObject.id.toString()] = sceneObject;
    }
    addUniqueIdentifier(sceneObject) {
        this.uniqueIdentifierToObj[sceneObject.uniqueIdentifier] = sceneObject;
    }
    convertToLensStudioObject(sceneObject) {
        const uuid = Editor.Engine.idFromUniqueIdentifier(sceneObject.uniqueIdentifier).toString();
        return this.uuidToObj[uuid];
    }
    convertToLensCoreObject(sceneObject) {
        const uniqueIdentifier = sceneObject.id.toString();
        return this.uniqueIdentifierToObj[uniqueIdentifier];
    }
    addLensCoreHierarchy(root) {
        if (root.layer.contains(_GizmoUtils.module.GizmoUtils.GIZMO_LAYER) || root.layer.contains(_Utils.module.Utils.SYSTEM_LAYER)) {
            return;
        }
        this.addUniqueIdentifier(root);
        const childrenCount = root.getChildrenCount();
        for (let i = 0; i < childrenCount; i++) {
            this.addLensCoreHierarchy(root.getChild(i));
        }
    }
    addLensStudioHierarchy(root) {
        if (!root) {
            return;
        }
        this.addUUID(root);
        root.children.forEach((child) => {
            this.addLensStudioHierarchy(child);
        });
    }
    collectLensCoreObjects(rule) {
        const result = [];
        for (let key in this.uniqueIdentifierToObj) {
            const object = this.uniqueIdentifierToObj[key];
            if (rule(object)) {
                result.push(object);
            }
        }
        return result;
    }
    reset() {
        this.uuidToObj = {};
        this.uniqueIdentifierToObj = {};
    }
}
exports.ObjectConverter = ObjectConverter;
