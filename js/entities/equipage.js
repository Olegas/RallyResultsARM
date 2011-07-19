function Equipage(params) {

    params = params || {};

    this._id = params.id || 0,
    this._first = params.first || "";
    this._second = params.second || "";
    this._teamId = params.teamId || 0;
    this._car = params.car || "";
    this._competitionId = params.competitionId || 0;
}

Equipage.getName = function() {
    return "Equipage";
};

Equipage.newInstance = function(params) {
    return new Equipage(params);
};

Equipage.getStruct = function() {
    return {
        first: 'text',
        second: 'text',
        competitionId: 'integer',
        teamId: 'integer',
        car: 'text'
    };
};

Equipage.prototype.toObject = function() {
    return {
        first: this._first,
        second: this._second,
        competitionId: this._competitionId,
        teamId: this._teamId,
        car: this._car
    }
};

Equipage.prototype.setCar = function(car) {
    this._car = car;
};

Equipage.prototype.setFirst = function(first) {
    this._first = first;
};

Equipage.prototype.setSecond = function(second) {
    this._second = second;
};

Equipage.prototype.getCar = function() {
    return this._car;
};

Equipage.prototype.getFirst = function() {
    return this._first;
};

Equipage.prototype.getSecond = function() {
    return this._second;
};

