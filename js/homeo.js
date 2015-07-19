var HomeoPuzzle = function()
{
    var ret = {'dmg': 8};
    var isActive = false;

    var canvasTop, rendererTop;

    var renderers = [];
    var angles = [];

    ret.getRandomState = function()
    {
        return [1, 2, 3, 4, 5, 6];
    }

    var setListeners = function(canvas, renderer) {
        renderers.push(renderer);
        if (!isActive) return;

        var a1 = 0, a2 = 0, dragging = false, dx, dy, myAngles = [];
        angles.push(myAngles);
        $(canvas).on('mousedown', function(e) {
            dx = e.pageX, dy = e.pageY;
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
        $(canvas).on('mouseup', function() {
            dragging = false;
        });
    }

    ret.startGame = function(elem, state, active)
    {
        isActive = active;
        canvasTop = $('<canvas>').attr('width', 380).attr('height', 150)
                                  .css('width', '380px').css('height', '150px')
                                  .css('top', '10px').css('left', '10px')
                                  .css('position', 'absolute');
        rendererTop = GetRenderer(canvasTop.get(0));
        rendererTop.drawScene(0, 0);
        setListeners(canvasTop, rendererTop);

        $(elem).append(canvasTop);

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
        return angles;
    }
    return ret;
}


