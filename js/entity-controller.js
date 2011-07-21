(function($){
$.fn.entityList = function(cfg) {

    cfg = cfg || {};

    var _methods = {
        on: function(event, listener) {
            this.find('ul').bind(event, listener);
        },
        selection: function() {
            return this.find('.item-selected').attr('eid') || null;
        },
        yourSibling: function(eName, relation) {
            var d = this.find('ul').data('siblings') || [];
            d.push(eName);
            this.find('ul').data('siblings', d).data(eName + '-relation', relation);
        },
        reload: function() {
            debugger;
        }
    };

    if(typeof cfg == "string") {
        if(cfg in _methods)
            return _methods[cfg].apply(this, Array.prototype.slice.call(arguments, 1));
        else
            throw new Error("No such method");
    }

    var _where = {};
    var _list = $("<ul class='item-list'></ul>");

    var _entityConstructor = cfg.entity;
    var _app = cfg.app;
    var _relation = cfg.relation || null;
    var _requiredListFilter = cfg.requiredListFilter || [];
    var _master = cfg.master || null;
    var _currentEntity = null;

    if(!(_relation instanceof Array) && _relation != null)
        _relation = [ _relation ];
    if(!(_master instanceof Array) && _master != null)
        _master = [ _master ];

    var _entityId = this.eq(0).attr('id').replace('list-', '');

    var _addLink = $("<a href='#'>Добавить</a>");
    var _form = $("#form-" + _entityId).dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Save": function() {
                _form.find('input').each(function(){
                    var n = this.name;
                    if(_currentEntity != null && typeof _currentEntity['set' + n] == 'function') {
                        _currentEntity['set' + n](this.value);
                    }
                });
                _app.getDb()[_currentEntity._id == 0 ? 'put' : 'update'](_currentEntity).done(function(){
                    reloadList();
                    clearForm();
                    _form.dialog("close");
                }).fail(function(e){
                    alert(e);
                    _form.dialog("close");
                })
            },
            "Cancel": function() {
                _currentEntity = null;
                _form.dialog( "close" );
            }
        }
    });


    if(_master != null) {
        for(var i = 0, l = _master.length; i<l; i++) {
            _master[i].entityList("on", "selected", (function(ctx, relation){
                return function(event, value) {
                    filter.apply(ctx, [relation, value]);
                }
            })(this, _relation[i]));
            _master[i].entityList("yourSibling", _entityConstructor.getName(), _relation[i]);
        }
    }

    _addLink.click(function(){
        var init = {};
        if(_master != null) {
            for(var i = 0, l = _master.length; i < l; i++) {
                var sId = _master[i].entityList('selection');
                if(sId != null)
                    init[_relation[i]] = sId;
                else
                    return false;
            }
        }
        _currentEntity = _entityConstructor.newInstance(init);
        _form.dialog("open");
        return false;
    }).button({
        icons: {
            primary: 'btn-add'
        }
    });

    $('li', _list.get(0)).live('mouseover', function(){
        $(this).find('.actions-bar').show();
    }).live('mouseout', function(){
        $(this).find('.actions-bar').hide();
    }).live('click', function(){
        var has = $(this).hasClass('item-selected');
        _list.find('li').removeClass('item-selected');
        if(!has) {
            $(this).addClass('item-selected');
            _list.trigger('selected', this.getAttribute('eId'));
        } else
            _list.trigger('selected', undefined);
    });


    $('.edit', _list.get(0)).live('click', function(){
        _app.getDb().read(_entityConstructor, $(this).parents('li').attr('eId')).done(function(entity){
            _currentEntity = entity;
            _form.find('input').each(function(){
                var n = this.name;
                if(typeof entity['get' + n] == 'function') {
                    this.value = entity['get' + n]();
                }
            });
            _form.dialog("open");
        });
    });

    $('.editmode', _list.get(0)).live('click', function(){
        var col = _list.find('li .editmode');
        col.draggable("option", "disabled", col.toggleClass('connect').toggleClass('reorder').hasClass('reorder'));
        return false;
    });

    $('.delete', _list.get(0)).live('click', function(){
        if(confirm("Delete?"))
            _app.getDb().remove(_entityConstructor, { id: $(this).parents('li').attr('eId') }).done(function(){
                reloadList();
                clearForm();
                _form.dialog("close");
            });
    });

    this.append(_addLink);
    this.append(_list);
    if(cfg.sortable) {
        _list.sortable({
            stop: function(e, ui) {
                var sql = [];
                var data = [];
                var tN = _entityConstructor.getName();
                _list.find('li').each(function(idx){
                    sql.push("UPDATE " + tN + " SET `order` = ? WHERE id = ?");
                    data.push([idx, this.getAttribute('eId')]);
                });
                if(sql.length > 0) {
                    app.getDb()._db.transaction(function(tx){
                        for(var i = 0, l = sql.length; i<l; i++)
                            tx.executeSql(sql[i], data[i], function(){}, function(t, e){ console.log(e.message); });
                    })
                }
            }
        });
    }

    function reloadList() {
        var order = cfg.sortable ? [ '`order` ASC' ] : [];
        _list.children().remove();
        if(_requiredListFilter != null) {
            for(var i = 0, l = _requiredListFilter.length; i < l; i++) {
                if(!(_requiredListFilter[i] in _where))
                    return;
            }
        }
        _app.getDb().list(_entityConstructor, _where, order).done(function(list){
            for(var i = 0, l = list.length; i<l; i++) {
                var tpl = "<li eName='" + _entityConstructor.getName() + "' eId='" + list[i]._id + "'><div class='actions-bar'>" +
                        (_master != null ? "<div class='actions editmode reorder'></div>" : '') +
                        "<div class='actions edit'></div>" +
                        "<div class='actions delete'></div></div>";
                var s = _entityConstructor.getStruct();
                for(var f in s) {
                    if(s.hasOwnProperty(f) && s[f] == 'text') {
                        tpl += list[i]['get' + ucfirst(f)]() + "<br />";
                    }
                }
                _list.append(tpl + "</li>");
            }
            if(_master != null) {
                _list.find('li').draggable({
                    helper: 'clone',
                    opacity: 0.6,
                    revert: true,
                    disabled: true
                })
            }
            _list.find('li').droppable({
                accept: function(drag) {
                    return (_list.data('siblings') || []).indexOf(drag.attr('eName')) != -1 && drag.find('.connect').length > 0;
                },
                hoverClass: 'dropHere',
                activeClass: 'canDrop',
                drop: function(e, ui) {
                    var tN = ui.draggable.attr('eName');
                    var data = [ this.getAttribute('eId'), ui.draggable.attr('eId') ];
                    var rN = $(this).parent().data(tN + '-relation');
                    var sql = "UPDATE " + tN + " SET " + rN + " = ? WHERE id = ?";

                    _app.getDb()._db.transaction(function(tx){
                        tx.executeSql(sql, data, function(){
                            ui.draggable.parent().entityList('reload');
                        });
                    })
                }
            });
            _list.trigger('reloaded', [ _list ]);
        })
    }

    function clearForm() {
        _form.find('input').each(function(){
            this.value = '';
        });
    }

    function filter(relation, value) {
        if(value !== undefined)
            _where[relation] = value;
        else
            delete _where[relation];
        reloadList();
    }

    reloadList();

    return this;
};
})(jQuery);