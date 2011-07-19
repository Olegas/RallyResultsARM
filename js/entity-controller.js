(function($){
$.fn.entityList = function(cfg) {

    cfg = cfg || {};

    var _methods = {
        on: function(event, listener) {
            this.find('ul').bind(event, listener);
        },
        selection: function() {
            return this.find('.item-selected').attr('eid') || null;
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
        height: 300,
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
        for(var i = 0, l = _master.length; i<l; i++)
            _master[i].entityList("on", "selected", (function(ctx, relation){
                return function(event, value) {
                    filter.apply(ctx, [relation, value]);
                }
            })(this, _relation[i]));
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
    });

    $('li', _list.get(0)).live('mouseover', function(){
        $(this).find('.actions').show();
    }).live('mouseout', function(){
        $(this).find('.actions').hide();
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
        _app.getDb().read(_entityConstructor, $(this).parent('li').attr('eId')).done(function(entity){
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

    $('.delete', _list.get(0)).live('click', function(){
        if(confirm("Delete?"))
            _app.getDb().remove(_entityConstructor, { id: $(this).parent('li').attr('eId') }).done(function(){
                reloadList();
                clearForm();
                _form.dialog("close");
            });
    });

    this.append(_addLink);
    this.append(_list);

    function reloadList() {
        _list.children().remove();
        if(_relation != null) {
            for(var i = 0, l = _relation.length; i < l; i++) {
                if(!(_relation[i] in _where))
                    return;
            }
        }
        _app.getDb().list(_entityConstructor, _where).done(function(list){
            for(var i = 0, l = list.length; i<l; i++) {
                var tpl = "<li eId='" + list[i]._id + "'><div class='actions edit'></div><div class='actions delete'></div>";
                var s = _entityConstructor.getStruct();
                for(var f in s) {
                    if(s.hasOwnProperty(f) && s[f] == 'text') {
                        tpl += list[i]['get' + ucfirst(f)]() + "<br />";
                    }
                }
                _list.append(tpl + "</li>");
            }
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