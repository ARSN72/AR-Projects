"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var RequireModule = require("RequireModule");
if (false) {
    require("@src/Editor/ObservableProperty");
}
const _ObservableProperty = RequireModule.requireModule("@src/Editor/ObservableProperty");
var Config;
(function (Config) {
    Config.MaxAttachScreenDistance = 0.01;
    Config.isSnappingEnabled = new _ObservableProperty.module.ObservableProperty(false);
    Config.isRecalculateEnabled = new _ObservableProperty.module.ObservableProperty(false);
    Config.isIsolated = new _ObservableProperty.module.ObservableProperty(false);
    Config.isRulerEnabled = new _ObservableProperty.module.ObservableProperty(true);
    Config.isGuideEnabled = new _ObservableProperty.module.ObservableProperty(false);
    Config.isSnappingToGuideEnabled = new _ObservableProperty.module.ObservableProperty(false);
})(Config = exports.Config || (exports.Config = {}));
