if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input Component.Camera camera
checkUndefined("camera", []);
// @input Component.ScriptComponent hint
checkUndefined("hint", []);
var RequireModule = require("RequireModule");
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
if (false) {
	 require("../../../../Modules/Src/Editor/Tools/Recalculate");
}
var Module = RequireModule.requireModule("../../../../Modules/Src/Editor/Tools/Recalculate");
Object.setPrototypeOf(script, Module.module.Recalculate.prototype);
script.__initialize();
if (script.onAwake) {
   script.onAwake();
}
