var app = new RL({
    showRedrawRects: true,
    coreClockHz: 100
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

    var sprite = new app.Sprite('foo', 'https://a248.e.akamai.net/assets.github.com/images/modules/logos_page/Octocat.png?1366128849');
    sprite.bind('ready', function() {

        var foo = new app.Element('foo', -800, 100, 0, 800, 665, sprite);
        app.bind('tick', function() {
            foo.x += 10;
            if(foo.x >= innerWidth) { foo.x = -foo.width; }
        });

        var bar = new app.Element('bar', innerWidth + 800, 100, 0, 800, 665, sprite);
        app.bind('tick', function() {
            bar.x += -10;
            if(bar.x < -800) { bar.x = innerWidth + 800; }
        });

        var baz = new app.Element('baz', innerWidth / 2 - 400, -665, 0, 800, 665, sprite);
        app.bind('tick', function() {
            baz.y += 10;
            if(baz.y >= innerHeight + baz.height) { baz.y = -665; }
        });

        main.append(foo);
        main.append(bar);
        main.append(baz);
    });

    app.start();
    viewport.start();
});

