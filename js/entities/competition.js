function Competition(params) {

    params = params || {};

    this._id = params.id || 0;
    this._name = params.name || '';
    this._sections = null;

}

Competition.newInstance = function(args) {
    return new Competition(args);
};

Competition.getStruct = function() {
    return {
        name: 'text'
    }
};

Competition.getName = function() {
    return "Competition";
};

Competition.prototype.getName = function() {
    return this._name;
};

Competition.prototype.setName = function(name) {
    this._name = name || "Unnamed";
};

Competition.prototype.toObject = function() {
    return {
        name: this._name
    };
};

Competition.prototype.getSections = function() {
    var dR = $.Deferred();
    var self = this;
    if(this._sections === null) {
        new LocalDatabase().list(Section, { competitionId: this._id }).done(function(r){
            self._sections = r;
            dR.resolve(r);
        })
    } else
        dR.resolve(this._sections);
    return dR.promise();
};

Competition.prototype.addSection = function(section) {
    section._competitionId = this._id;
    return new LocalDatabase()[section._id == 0 ? 'put' : 'update'](section);
};
