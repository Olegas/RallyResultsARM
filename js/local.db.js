var LocalDatabase = function() {
    this._db = openDatabase('Res', '1.0', 'Res database', 1000);

    this._registered = [];

    this._ensureEntityStorage = function(entity) {
        var dR = $.Deferred();
        var table = entity.getName();
        var struct = entity.getStruct();
        this._db.transaction(function(tx){
            tx.executeSql("SELECT COUNT(*) FROM " + table, [], function(){
                dR.resolve();
            }, function(){
                var sql = "CREATE TABLE " + table + "(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, ";
                var fDef = [];
                for(var f in struct) {
                    if(struct.hasOwnProperty(f)) {
                        fDef.push(f + ' ' + struct[f]);
                    }
                }
                tx.executeSql(sql + fDef.join(', ') + ')', [], function(ts, r) {
                    dR.resolve();
                }, function(ts, e){
                    dR.feject(e.message);
                });

            });
        });
        return dR.promise();
    };
};

LocalDatabase.prototype.registerEntity = function(entity) {
    var dR = $.Deferred();
    if(this._registered.indexOf(entity.getName()) == -1) {
        var self = this;
        this._ensureEntityStorage(entity).done(function(){
            self._registered.push(entity.getName());
            dR.resolve();
        }).fail(function(){
            dR.reject();
        });
    } else
        dR.resolve();
    return dR.promise();
};


LocalDatabase.prototype.read = function(entity, id) {
    var dR = $.Deferred();
    var table = entity.getName();
    this._db.transaction(function(tx){
        var sql =  "SELECT * FROM " + table + " WHERE id = ?";
        tx.executeSql(sql, [ id ], function(tx, result){
            dR.resolve(entity['newInstance'](result.rows.item(0)));
        }, function(){
            dR.reject();
        });
    });
    return dR;
};

LocalDatabase.prototype.update = function(entity) {
    var dR = $.Deferred();
    var table = entity.constructor.getName();
    var eData = entity.toObject();
    this._db.transaction(function(tx){
        var sql =  "UPDATE " + table + " SET ";
        var fields = [], data = [], marks = [];
        for(var f in eData) {
            if(eData.hasOwnProperty(f) && f !== 'id') {
                fields.push(f + " = ? ");
                data.push(eData[f]);
            }
        }
        data.push(entity._id);
        sql += fields.join(", ") + " WHERE id = ?";
        tx.executeSql(sql, data, function(){
            dR.resolve();
        }, function(tx, error){
            dR.reject(error.message);
        });
    });
    return dR.promise();
};

LocalDatabase.prototype.list = function(entity, where, order) {
    var dR = $.Deferred();
    var table = entity.getName();
    order = order || [];
    this._db.transaction(function(tx){
        var sql =  "SELECT * FROM " + table + " WHERE ";
        var fields = [], data = [], marks = [];
        for(var f in where) {
            if(where.hasOwnProperty(f)) {
                fields.push(f + ' = ?');
                marks.push('?');
                data.push(where[f]);
            }
        }
        if(fields.length > 0)
            sql += fields.join(" AND ");
        else
            sql += " id > 0";
        if(order.length > 0)
            sql += " ORDER BY " + order.join(', ');
        tx.executeSql(sql, data, function(tx, result){
            var res = [];
            for(var i = 0, l = result.rows.length; i < l; i++) {
                res.push(entity['newInstance'](result.rows.item(i)));
            }
            dR.resolve(res);
        }, function(tx, error){
            console.error(error.message);
            dR.reject();
        });
    });
    return dR.promise();
};

LocalDatabase.prototype.remove = function(entity, where) {
    var dR = $.Deferred();
    var table = entity.getName();
    this._db.transaction(function(tx){
        var sql = "DELETE FROM " + table;
        if(where) {
            var id = parseInt(where, 10);
            if(id > 0) {
                where = { 'id': id };
            }
            if(where instanceof Object) {
                var args = [], marks = [], data = [];
                for(var f in where) {
                    if(where.hasOwnProperty(f)) {
                        args.push(f + " = ?");
                        marks.push('?');
                        data.push(where[f]);
                    }
                }
                if(args.length > 0)
                sql += " WHERE " + args.join(" AND ");
            }
        }
        tx.executeSql(sql, data || [], function(tx, result){
            dR.resolve();
        }, function(tx, error){
            dR.reject(error.message);
        })
    });
    return dR.promise();
};

LocalDatabase.prototype.put = function(entity) {
    var dR = $.Deferred();
    var table = entity.constructor.getName();
    var eData = entity.toObject();
    this._db.transaction(function(tx){
        var sql =  "INSERT INTO " + table + " (";
        var fields = [], data = [], marks = [];
        for(var f in eData) {
            if(eData.hasOwnProperty(f) && f !== 'id') {
                fields.push(f);
                marks.push('?');
                data.push(eData[f]);
            }
        }
        sql += fields.join(", ") + ") VALUES (" + marks.join(',') + ")";
        console.log(sql);
        tx.executeSql(sql, data, function(tx, result){
            entity._id = result.insertId;
            dR.resolve(entity);
        }, function(tx, error){
            console.error(error.message);
            dR.reject(error.message);
        });
    });
    return dR.promise();
};