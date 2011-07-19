function App() {
    this._db = new LocalDatabase;
    this.ready = $.when(
            this._db.registerEntity(Competition),
            this._db.registerEntity(Section),
            this._db.registerEntity(Team),
            this._db.registerEntity(Equipage));
}

App.prototype.getDb = function() {
    return this._db;
};



