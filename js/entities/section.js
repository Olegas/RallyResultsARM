function Section(params) {

    params = params || {};

    this._id = params.id || 0;
    this._name = params.name || "";
    this._competitionId = params.competitionId || 0;

}

Section.prototype.getName = function() {
    return this._name;
};

Section.prototype.setName = function(name) {
    this._name = name;
};

Section.newInstance = function(args) {
    return new Section(args);
};

Section.getStruct = function() {
    return {
        name: 'text',
        competitionId: 'integer'
    }
};

Section.getName = function() {
    return "Section";
};

Section.prototype.toObject = function() {
    return {
        name: this._name,
        competitionId: this._competitionId
    };
};