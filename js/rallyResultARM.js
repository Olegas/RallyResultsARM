var app = new App();



app.ready.done(function(){

    var cL = $('#list-competition').entityList({
        app: app,
        entity: Competition
    });

    var sL = $('#list-sections').entityList({
        app: app,
        entity: Section,
        master: cL,
        sortable: true,
        relation: 'competitionId'
    });

    var teL = $('#list-teams').entityList({
        app: app,
        entity: Team
    });

    var eqL = $('#list-equipage').entityList({
        app: app,
        entity: Equipage,
        master: [cL, teL],
        sortable: true,
        relation: ['competitionId', 'teamId']
    });

});