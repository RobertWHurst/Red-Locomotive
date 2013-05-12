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

    var sprite = app.Sprite('foo', 'https://github.com/jdlrobson/WLMMobile/diff_blob/03ac4b206367c28deed70747d626ee7a28ee2e69/assets/www/images/placeholder-full-photo.png?raw=true');
    sprite.bind('ready', function() {

        var foo = app.Element('foo', -300, 300, 0, 300, 240, sprite);
        app.bind('tick', function() {
            foo.x += 1;
            if(foo.x >= innerWidth) { foo.x = -foo.width; }
        });

        main.append(foo);
    });

    app.start();
    viewport.start();
});

