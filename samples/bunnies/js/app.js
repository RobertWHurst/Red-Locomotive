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

    var bunnySprite = app.Sprite('bunny', 'img/bunny.png');

    var active = false;
    var i = 1;
    window.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
            if(active) {
                app.stop();
                viewport.stop();
                active = false;
            }else {
                app.start();
                viewport.start();
                active = true;
            }
        }
        if(event.keyCode == 13) {
            app.config('showRedrawRects', !app.config('showRedrawRects'));
        }
        if(event.keyCode == 66) {
            createBunny(i++);
        }
    });

    function createBunny(id) {
        var bunny = app.Element('bunny-' + id, RL.random(100), RL.random(100), 0, 26, 36, bunnySprite);
        var xd = RL.random(1) + 0.1;
        var yd = RL.random(1) + 0.1;
        app.bind('tick', function() {
            bunny.x += xd;
            bunny.y += yd;
            if(bunny.x < 0 || bunny.x + bunny.width > innerWidth) { xd = -xd; }
            if(bunny.y < 0 || bunny.y + bunny.height > innerHeight) { yd = -yd; }
        });
        main.append(bunny);
    }
});
