Array.prototype.toDictionary = function () {
    var dictionary = {}
    for (var index = 0; index < this.length; index++) {
        dictionary[index] = this[index]
    }
    return dictionary
}

Date.current = function () {
    return Math.floor(Date.now() / 1000) - 30
}