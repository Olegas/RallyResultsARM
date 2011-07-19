var DBWrapper = function() {
    this._db = new LocalDatabase();
    this._db.registerEntity(Competition);
};


DBWrapper.prototype.create = function(entity) {

};

/**
 *
 * @param cEntity
 * @param id
 */
DBWrapper.prototype.read = function(cEntity, id) {
    this._db.read(cEntity, id);
};

DBWrapper.prototype.update = function(entity) {

};

DBWrapper.prototype.destroy = function(entity) {

};