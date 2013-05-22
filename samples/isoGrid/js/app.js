var app = new RL({
    showRedrawRects: false,
    coreClockHz: 'r'
});
viewport = new app.Viewport('main', 0, 0, 0, 0, '#fff');

window.addEventListener('load', function() {

    window.addEventListener('resize', function() {
        viewport.width = innerWidth;
        viewport.height = innerHeight;
    });
    viewport.width = innerWidth;
    viewport.height = innerHeight;
    document.body.appendChild(viewport.node);

    var main = new app.Stage('main');
    viewport.stage = main;

    var grid = new RL.IsoGrid(64, innerWidth / 2, innerHeight/ 2);

    var tileSprite = new app.Sprite('tile', 'img/tile.png');
    tileSprite.bind('ready', function() {

        var gridSize = 44;
        var y = gridSize;
        while(y-- > -gridSize) {
            var x = gridSize;
            while(x-- > -gridSize) {
                var rect = grid.cellRect(x, y);
                var tile = new app.Element('tile-(' + x + ',' + y + ')', rect.x, rect.y, 0, 64, 32, tileSprite);
                main.append(tile);
            }
        }
    });

    var bunnySprite = new app.Sprite('bunny', 'img/bunny.png');
    var bunny = new app.Element('bunny', -26, 0, 1, 26, 36, bunnySprite);
    main.append(bunny);

    var x, y;
    window.addEventListener('mousemove', function(e) {
        x = e.pageX - bunny.width / 2;
        y = e.pageY - bunny.height / 2;
    });
    app.bind('tick', function() {
        bunny.x = x;
        bunny.y = y;
    });

    app.start();
    viewport.start();
});

