"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
class Button {
    constructor(so, cam, newHintObj, useMaterial, onTap, onHover = null) {
        this.onHover = onHover;
        this.hintObj = null;
        this.isHovered = false;
        this.so = so;
        this.child = this.createChild(so);
        this.cam = cam;
        this.onTapCallback = onTap;
        this.useMaterial = useMaterial;
        this.hintObj = newHintObj;
        this.mainMaterial = this.so.getComponent("Component.Image").mainMaterial;
        this.createInteractionComponentOnSceneObject();
        this.createScriptComponentWithEvents();
    }
    createChild(root) {
        const newChild = global.scene.createSceneObject("");
        newChild.setParent(root);
        return newChild;
    }
    createInteractionComponentOnSceneObject() {
        if (this.so.getComponents("Component.Image").length > 0) {
            this.image = this.so.getComponent("Component.Image");
        }
        this.interactionComponent = this.child.createComponent("Component.InteractionComponent");
        this.interactionComponent.isFilteredByDepth = true;
        this.interactionComponent.setCamera(this.cam);
        this.interactionComponent.addMeshVisual(this.image);
    }
    createScriptComponentWithEvents() {
        var _a, _b;
        let skipTap = false;
        let startTouch = vec2.zero();
        this.interactionComponent.onTouchStart.add((eventData) => {
            startTouch = eventData.position;
            if (this.useMaterial) {
                this.mainMaterial.mainPass.Active = !this.mainMaterial.mainPass.Active;
            }
            skipTap = false;
        });
        this.interactionComponent.onTouchMove.add((eventData) => {
            if (eventData.position.x !== startTouch.x || eventData.position.y !== startTouch.y) {
                skipTap = true;
            }
        });
        this.interactionComponent.onTouchEnd.add((eventData) => {
            if (this.useMaterial) {
                this.mainMaterial.mainPass.Active = !this.mainMaterial.mainPass.Active;
            }
            if (!skipTap) {
                this.onTapCallback();
            }
        });
        (_a = this.interactionComponent.onHoverStart) === null || _a === void 0 ? void 0 : _a.add(() => {
            this.isHovered = true;
            this.onHover && this.onHover(true);
        });
        (_b = this.interactionComponent.onHoverEnd) === null || _b === void 0 ? void 0 : _b.add(() => {
            this.isHovered = false;
            this.onHover && this.onHover(false);
        });
        // this.interactionComponent.onHover?.add(() => {
        //     this.isHovered = true;
        //     this.onHover && this.onHover(true);
        // })
        let script = this.child.createComponent("ScriptComponent");
        script.createEvent("LateUpdateEvent").bind(() => {
            if (this.mainMaterial) {
                this.mainMaterial.mainPass.Hover = this.isHovered;
                if (this.hintObj) {
                    this.hintObj.enabled = this.isHovered;
                }
            }
            // if (this.isHovered && this.onHover) {
            //     this.onHover(false);
            // }
            // this.isHovered = false;
        });
    }
    setNewHintObject(newHintObj) {
        this.hintObj = newHintObj;
    }
}
exports.Button = Button;
