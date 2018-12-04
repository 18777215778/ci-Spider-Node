module.exports = {
    getTarget,
    deepCopy
};


function getTarget(map, path) {
    path = path.split(" > ");

    for (let i=0, p; p = path[i++];) {
        if (map[p]) {
            map = map[p];
        } else {
            map = null;
            break
        }
    }
    return map
}


function deepCopy(obj) {
    return Object.assign({}, obj);
}