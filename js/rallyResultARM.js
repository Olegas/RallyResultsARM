var app = new App();



app.ready.done(function(){

    window.onhashchange = function() {
        var h = location.hash;
        if(h.indexOf('#!/') === 0) {
            if(h.indexOf('#!/stats/') === 0) {

            }
        }
    };

    var cL = $('#list-competition').entityList({
        app: app,
        entity: Competition
    });

    var sL = $('#list-sections').entityList({
        app: app,
        entity: Section,
        master: cL,
        sortable: true,
        relation: 'competitionId',
        requiredListFilter: [ 'competitionId' ]
    });
    /*.bind('reloaded', function(e, list){
        list.find('.actions-bar').append("<div class='actions stats'></div>");
    });

    $('.stats', sL.find('ul')).live('click', function(){
        var cId = cL.find('.item-selected').attr('eId');
        var sId = sL.find('.item-selected').attr('eId');
        location = '#!/stats/competitionId/' + cId + '/sectionId/' + sId + '/';
    });*/

    var teL = $('#list-teams').entityList({
        app: app,
        entity: Team
    });

    var eqL = $('#list-equipage').entityList({
        app: app,
        entity: Equipage,
        master: [cL, teL],
        sortable: true,
        relation: ['competitionId', 'teamId'],
        requiredListFilter: [ 'competitionId' ]
    });

    $('#fillStat').button({
        icons: {
            primary: 'stats-i'
        }
    }).click(function(){
        return false;
    });

    $('#statsForm, #admin').height($(window).height());

});