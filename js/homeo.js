var HomeoPuzzle = function()
{
    var ret = {'dmg': 8};
    var isActive = false;

    var canvasTop, rendererTop;

    var renderers = [];
    var angles = [];

    var solved = false;
    var failed = false;

    ret.getRandomState = function()
    {
        var target = Math.floor(Math.random() * 3);
        var targetOrd;
        var o = [];
        o[0] = getObject(target);
        var used = [0, 0, 0];
        for (var i = 0; i < 3; ++ i) {
            var want = Math.floor(Math.random() * 3);
            while (used[want]) want = Math.floor(Math.random() * 3);
            used[want] = 1;
            o[i + 1] = getObject(want);
            if (want == target) targetOrd = i;
        }
        return [targetOrd, o[0], o[1], o[2], o[3]];
    }

    var setListeners = function(canvas, renderer, correct) {
        renderers.push(renderer);
        if (!isActive) return;

        var a1 = 0, a2 = 0, dragging = false, dx, dy, myAngles = [], ox, oy;
        angles.push(myAngles);
        $(canvas).on('mousedown', function(e) {
            dx = e.pageX, dy = e.pageY;
            ox = dx, oy = dy;
            dragging = true;
        });
        $(canvas).on('mousemove', function(e) {
            var x = e.pageX, y = e.pageY;
            if (dragging) {
                a1 += (y - dy) / 100.0;
                a2 += (x - dx) / 100.0;
                if (a1 > Math.PI / 2) a1 = Math.PI / 2;
                if (a1 < - Math.PI / 2) a1 = - Math.PI / 2;
                renderer.drawScene(a1, a2);
                dx = x, dy = y;
            }
            myAngles[0] = a1;
            myAngles[1] = a2;
        });
        $(canvas).on('mouseup', function(e) {
            var x = e.pageX, y = e.pageY;
            if (dragging) {
                if (correct !== -1 && Math.abs(x - ox) < 5 && Math.abs(y - oy) < 5) {
                    if (correct) solved = true;
                    else failed = true;
                }
            }
            dragging = false;
        });
    }

    var getObject = function(kind) {
        var V = [{'x': -1, 'y': 0, 'z': 0},
                         {'x': -0.4, 'y': 1, 'z': 0},
                         {'x': 0.4, 'y': 1, 'z': 0},
                         {'x': 1, 'y': 0, 'z': 0},
                         {'x': 0.4, 'y': -1, 'z': 0},
                         {'x': -0.4, 'y': -1, 'z': 0}
                         ];
        var E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
        if (kind == 0) {
            if (Math.random() < 0.3) {
                E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 3]];
            }
            else if (Math.random() < 0.5) {
                V[0].x = 0;
                E = [[0, 1], [1, 2], [2, 0], [3, 0], [4, 1], [5, 2]];
            }
        }
        if (kind == 1) {
            E.push([0, Math.floor(Math.random() * 3 + 2)]);
            if (Math.random() < 0.3) {
                E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 3], [0, 2]];
            }
            else if (Math.random() < 0.5) {
                V = [{'x': -1.2, 'y': 0, 'z': 0},
                         {'x': 1.2, 'y': 0, 'z': 0},
                         {'x': -0.7, 'y': 0, 'z': 0},
                         {'x': 0, 'y': 1, 'z': 0},
                         {'x': 0, 'y': -1, 'z': 0},
                         {'x': 0.7, 'y': 0, 'z': 0}
                         ];
                E = [[2, 3], [3, 4], [4, 2], [5, 3], [3, 4], [4, 5], [0, 2], [1, 3]];
            }
        }
        if (kind == 2) {
            if (Math.random() < 0.5) {
                E.push([0, 2]);
                E.push([2, 4]);
            }
            else {
                E.push([0, 2]);
                E.push([3, 5]);
            }
        }
        var ret = {'V': V, 'E': E};

        for (var i = 0; i < 6; ++ i) {
            ret.V[i].z = Math.random() * 2 - 1;
            ret.V[i].x += Math.random() * 0.1 - 0.05;
            ret.V[i].y += Math.random() * 0.1 - 0.05;
        }

        return ret;
    }

    ret.startGame = function(elem, state, active)
    {
        isActive = active;
        canvasTop = $('<canvas>').attr('width', 380).attr('height', 150)
                                  .css('width', '380px').css('height', '150px')
                                  .css('top', '10px').css('left', '10px')
                                  .css('position', 'absolute');
        var object = state[1];
        rendererTop = GetRenderer(canvasTop.get(0), object.V, object.E);
        rendererTop.drawScene(0, 0);
        setListeners(canvasTop, rendererTop, -1);

        $(elem).append(canvasTop);

        for (var i = 0; i < 3; ++ i) {
            var canvas = $('<canvas>').attr('width', 120).attr('height', 120)
                                      .css('width', '120px').css('height', '120px')
                                      .css('top', '300px').css('left', (10 + 130 * i) + 'px')
                                      .css('position', 'absolute');
            var object = state[i + 2];
            var renderer = GetRenderer(canvas.get(0), object.V, object.E);
            renderer.drawScene(0, 0);
            setListeners(canvas, renderer, i == state[0]);

            $(elem).append(canvas);
        }

        var text = "Find an object below that is <b>topologically equivalent</b> to the object above.<br><small>Two objects are topologically equivalent if one of them can be obtained from another by applying continuos deformations.</small>";
        var dv3 = creatediv(elem,2,text,350-6,100-6,25,25 + 75 + 75, '#888');
    }
    ret.applyEvent = function(evt)
    {
        if (isActive) return;
        for (var i = 0; i < renderers.length; ++ i) {
            renderers[i].drawScene(evt[i][0], evt[i][1]);
        }
    }
    ret.onTapDown = function(fingers)
    {
    }
    ret.onTapMove = function(fingers)
    {
    }
    ret.onTapUp = function(fingers)
    {
        if (solved) return 1;
        if (failed) return 2;
        return angles;
    }
    return ret;
}


