function Equipage(params) {

    params = params || {};

    this._id = params.id || 0,
    this._first = params.first || "";
    this._second = params.second || "";
    this._teamId = params.teamId || 0;
    this._number = params.number || "";
    this._car = params.car || "";
    this._order = params.order || 0;
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
        number: 'text',
        first: 'text',
        second: 'text',
        car: 'text',
        competitionId: 'integer',
        teamId: 'integer',
        order: 'integer'
    };
};

Equipage.prototype.toObject = function() {
    return {
        number: this._number,
        first: this._first,
        second: this._second,
        car: this._car,
        competitionId: this._competitionId,
        teamId: this._teamId
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

Equipage.prototype.setNumber = function(number) {
    this._number = number;
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

Equipage.prototype.getNumber = function() {
    return this._number;
};

