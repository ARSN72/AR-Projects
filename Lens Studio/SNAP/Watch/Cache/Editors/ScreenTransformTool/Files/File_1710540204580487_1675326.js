global.requireType = function(path) {
    path = path.substr(2, path.length);
    if (script[path]) {
        return script[path];
    } else {
        return "";
    }
};
