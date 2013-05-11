RL = RedLocomotive;

var app = RL();
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
        var foo = app.Element('foo', sprite, -800, 300, 800, 665);

        var diff = 2;
        app.bind('tick', function() {
            foo.x += diff
            if(foo.x >= innerWidth + foo.width) { diff = -2; }
            if(foo.x <= -foo.width * 2) { diff = 2; }
        });

        main.append(foo);
    });

    app.start();
    viewport.start();
});

