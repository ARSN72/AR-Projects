"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetCursorTexture = exports.setCursorTexture = exports.setInfo = exports.lastRotation = exports.lastCursorID = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/MouseCursor/CursorData");
}
const _CursorData = RequireModule.requireModule("@src/Editor/MouseCursor/CursorData");
exports.lastCursorID = "";
exports.lastRotation = 0;
let requestsQueue = [];
let cursorsStack = [];
let idToTexture = {};
let isActiveProcessing = false;
function setInfo(id, rotation) {
    exports.lastCursorID = id;
    exports.lastRotation = rotation;
}
exports.setInfo = setInfo;
function setCursorTexture(id, texture) {
    createOrUpdateCursor(id, texture);
    if (id === last(cursorsStack)) {
        requestsQueue.push([_CursorData.module.RequestType.SetCursor, texture]);
    }
    if (!isActiveProcessing && requestsQueue.length) {
        startProcessing();
    }
}
exports.setCursorTexture = setCursorTexture;
function resetCursorTexture(id) {
    const idx = cursorsStack.indexOf(id);
    cursorsStack.splice(idx, 1);
    if (idx !== cursorsStack.length) {
        return;
    }
    // if (cursorsStack.length) {
    //     requestsQueue.push([RequestType.SetCursor, idToTexture[last(cursorsStack)]]);
    // } else {
    requestsQueue.push([_CursorData.module.RequestType.UnsetCursor, null]);
    // }
    if (!isActiveProcessing) {
        startProcessing();
    }
}
exports.resetCursorTexture = resetCursorTexture;
function startProcessing() {
    isActiveProcessing = true;
    const request = requestsQueue.shift();
    performRequest(request[0], request[1]).then(() => {
        if (requestsQueue.length) {
            startProcessing();
        }
        else {
            isActiveProcessing = false;
        }
    }).catch((err) => {
        print("Failed to perform request " + request[0] + ". Reason: " + err);
    });
}
function createOrUpdateCursor(id, texture) {
    let cursorIdx = cursorsStack.indexOf(id);
    if (cursorIdx < 0) {
        cursorsStack.push(id);
    }
    idToTexture[id] = texture;
}
function performRequest(requestType, texture = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = RemoteApiRequest.create();
        request.endpoint = requestType;
        if (requestType === _CursorData.module.RequestType.SetCursor) {
            if (!texture) {
                throw new Error("No Texture Provided For Cursor");
            }
            request.uriResources = [yield convertTexture(texture)];
        }
        _CursorData.module.CursorRemoteServiceModule.performApiRequest(request, (response) => {
            if (response.statusCode !== 200) {
                print("Cursor request failed: " + response.body);
            }
        });
    });
}
function last(arr) {
    return arr[arr.length - 1];
}
function convertTexture(texture) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        return _CursorData.module.CursorRemoteMediaModule.createImageResourceForTexture(texture, _CursorData.module.CursorTextureUploadOptions);
    });
}
