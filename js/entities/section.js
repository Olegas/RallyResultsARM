function Section(params) {

    params = params || {};

    this._id = params.id || 0;
    this._name = params.name || "";
    this._competitionId = params.competitionId || 0;
    this._isCheckpoint = params.isCheckpoint || false;

}

Section.prototype.getName = function() {
    return this._name;
};

Section.prototype.setName = function(name) {
    this._name = name;
};

Section.prototype.getIsCheckpoint = function() {
    return this._isCheckpoint;
};

Section.prototype.setIsCheckpoint = function(isCheck) {
    this._isCheckpoint = isCheck;
};

Section.newInstance = function(args) {
    return new Section(args);
};

Section.getStruct = function() {
    return {
        name: 'text',
        competitionId: 'integer',
        isCheckpoint: 'boolean',
        order: 'integer'
    }
};

Section.getName = function() {
    return "Section";
};

Section.prototype.toObject = function() {
    return {
        name: this._name,
        competitionId: this._competitionId,
        isCheckpoint: this._isCheckpoint
    };
};