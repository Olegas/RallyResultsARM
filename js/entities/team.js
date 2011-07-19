function Team(params) {

    params = params || {};

    this._id = params.id || 0,
    this._name = params.name || "";
}

Team.getName = function() {
    return "Team";
};

Team.newInstance = function(params) {
    return new Team(params);
};

Team.getStruct = function() {
    return {
        name: 'text'
    };
};

Team.prototype.toObject = function() {
    return {
        name: this._name
    }
};

Team.prototype.setName = function(name) {
    this._name = name;
};

Team.prototype.getName = function() {
    return this._name;
};

