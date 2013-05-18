RL = RedLocomotive;

var app = RL();
app.config('showRedrawRects', true);
var viewport = app.Viewport('main', 0, 0, 0, 0, '#fff');

window.addEventListener('load', function() {

    window.addEventListener('resize', function() {
        viewport.resize(innerWidth, innerHeight);
    });

    viewport.resize(innerWidth, innerHeight);
    document.body.appendChild(viewport.element);

    var main = app.Stage('main');
    viewport.stage = main;

    var sprite = app.Sprite('foo', 'https://a248.e.akamai.net/assets.github.com/images/modules/logos_page/Octocat.png?1366128849');
    sprite.bind('ready', function() {

        var foo = app.Element('foo', -800, 100, 0, 800, 665, sprite);
        app.bind('tick', function() {
            foo.x += 1;
            if(foo.x >= innerWidth) { foo.x = -foo.width; }
        });

        var bar = app.Element('bar', innerWidth + 800, 100, 0, 800, 665, sprite);
        app.bind('tick', function() {
            bar.x += -1;
            if(bar.x < -800) { bar.x = innerWidth + 800; }
        });

        var baz = app.Element('baz', innerWidth / 2 - 400, -665, 0, 800, 665, sprite);
        app.bind('tick', function() {
            baz.y += 1;
            if(baz.y >= innerHeight + baz.height) { baz.y = -665; }
        });

        main.append(foo);
        main.append(bar);
        main.append(baz);
    });

    app.start();
    viewport.start();
});

