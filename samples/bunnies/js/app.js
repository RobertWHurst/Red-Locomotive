var app = new RL();
var viewport = new app.Viewport('main', 0, 0, 0, 0, '#fff');

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

    var bunnySprite = new app.Sprite('bunny', 'img/bunny.png');

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
            app.config.showRedrawRects = !app.config.showRedrawRects;
        }
        if(event.keyCode == 66) {
            var ii = 1000;
            while(ii--) {
                createBunny(i++);
            }
        }
    });

    function createBunny(id) {
        var bunny = new app.Element(
            'bunny-' + id,
            (innerWidth / 2) + (RL.random(100) - 50) - 26,
            (innerHeight / 2) + (RL.random(100) - 50) - 36,
            0,
            26,
            36,
            bunnySprite
        );
        var xd = RL.random(30) - 15;
        var yd = RL.random(30) - 15;
        app.bind('tick', function() {
            bunny.x += xd;
            bunny.y += yd;
            // if(bunny.x < -innerWidth || bunny.x + bunny.width > innerWidth * 2) { xd = -xd; }
            // if(bunny.y < -innerHeight || bunny.y + bunny.height > innerHeight * 2) { yd = -yd; }
            if(bunny.x < -innerWidth || bunny.x + bunny.width > innerWidth * 2) { xd = -xd; }
            if(bunny.y < -innerHeight || bunny.y + bunny.height > innerHeight * 2) { yd = -yd; }
        });
        main.append(bunny);
    }
});
