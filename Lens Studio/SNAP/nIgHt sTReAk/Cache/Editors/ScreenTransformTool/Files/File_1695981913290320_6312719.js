var __modules = {};

function getBaseName(path){
    return path.split('/').pop();
}


var requireModule = function(module) {
    module = getBaseName(module);
    if (!__modules[module]) {
        __modules[module] = {
            module: undefined
        };
        __modules[module].module = require(module);
    }
    return __modules[module];
}

exports.requireModule = requireModule;