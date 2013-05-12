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
        var foo = app.Element('foo', -800, 100, 0, 800, 665, sprite);

        // var x, y;
        // window.addEventListener('mousemove', function(event) {
        //     x = event.pageX;
        //     y = event.pageY;
        // });
        // app.bind('tick', function() {
        //     foo.cx = x;
        //     foo.cy = y;
        // });

        var diff = 1;
        app.bind('tick', function() {
            foo.x += diff
            if(foo.x >= innerWidth) { foo.x = -foo.width; }
        });

        main.append(foo);
    });

    app.start();
    viewport.start();
});

