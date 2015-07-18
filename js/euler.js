var EulerPuzzle = function()
{
    var ret = {'dmg': 7};
    var isActive = false;
    var canvas = null;
    var graph = null;
    var resetButton = null;

    var sm = [];
    var marked = [];

    var lastEvtV = -1;

    ret.getRandomState = function()
    {
        var graph = generateGraph(6, 10, true, false);
        return graph;
    }

    var renderGraph = function() {
        var ctx = canvas.get(0).getContext('2d');
        ctx.clearRect(0, 0, 380, 150);
        ctx.strokeStyle = '#000000';
        for (var idx in graph.E) {
            var vid1 = graph.E[idx][0];
            var vid2 = graph.E[idx][1];
            var v1 = graph.V[vid1];
            var v2 = graph.V[vid2];
            ctx.lineWidth = (marked[vid1][vid2]) ? 5 : 1;
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.stroke();
        }
        for (var idx in graph.V) {
            var v = graph.V[idx];
            if (idx != lastEvtV) {
                ctx.fillStyle = '#000000';
            }
            else {
                ctx.fillStyle = '#00D000';
            }
            ctx.beginPath();
            ctx.arc(v.x, v.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    ret.startGame = function(elem, state, active)
    {
        isActive = active;
        canvas = $('<canvas>').attr('width', 380).attr('height', 150)
                                  .css('width', '380px').css('height', '150px')
                                  .css('top', '10px').css('left', '10px')
                                  .css('position', 'absolute');
        graph = state;

        sm = []; marked = [];
        for (var idx in graph.V) {
            var lst = [];
            var lst2 = [];
            for (var id2 in graph.V) {
                lst.push(0);
                lst2.push(0);
            }
            sm.push(lst);
            marked.push(lst2);
        }

        for (var idx in graph.E) {
            var e = graph.E[idx];
            sm[e[0]][e[1]] = 1;
            sm[e[1]][e[0]] = 1;
        }

        $(elem).append(canvas);

        renderGraph();

        resetButton = $('<button>').css({'left': (200 - 50) + 'px', 'top': '300px', 'width': '100px', 'height': '75px', 'border': '1px solid #404040', 'position': 'absolute', 'background-color': '#E8E8E8'})
                                   .text('Start over')
                                   .appendTo($(elem));

        var text = "Find an <b>Euler Path</b> in the graph above. Tap each vertex of the path in order.<br><small>An Euler path is a path that traverses each edge exactly once</small>";
        var dv3 = creatediv(elem,2,text,350-6,100-6,25,25 + 75 + 75, '#888');
    }
    ret.applyEvent = function(evt)
    {
        if (evt[0] == -1) {
            for (idx in graph.V) {
                for (id2 in graph.V) {
                    marked[idx][id2] = 0;
                }
            }
            lastEvtV = -1;
        }
        else {
            marked[evt[0]][evt[1]] = marked[evt[1]][evt[0]] = 1;
            lastEvtV = evt[0];
        }
        renderGraph();
    }
    var lastV = -1;
    var getVertexUnderCursor = function(x, y) {
        var cand = graph.V[0];
        var ret = 0;
        for (var idx in graph.V) {
            var v = graph.V[idx];
            if (dist(x, y, v.x, v.y) < dist(x, y, cand.x, cand.y)) {
                cand = v;
                ret = idx;
            }
        }
        if (dist(x, y, cand.x, cand.y) < 30) return parseInt(ret);
        return -1;
    }

    ret.onTapDown = function(fingers)
    {
    }
    ret.onTapMove = function(fingers)
    {
    }
    ret.onTapUp = function(fingers)
    {
        if (fingers.length < 1 || !isActive) return;
        var x = fingers[0][1] - canvas.position().left;
        var y = fingers[0][2] - canvas.position().top;
        var off = resetButton.offset();
        if (x >= off.left && y >= off.top && x < off.left + resetButton.width() && y < off.top + resetButton.height()) {
            lastV = lastEvtV = -1;
            return [-1];
        }

        var ret = 0;
        if (lastV != -1) {
            var curV = getVertexUnderCursor(x, y);
            if (curV != -1 && curV != lastV && sm[curV][lastV] && !marked[curV][lastV]) {
                var oldV = lastV;
                lastV = curV;
                lastEvtV = curV;
                marked[curV][oldV] = 1;
                marked[oldV][curV] = 1;
                ret = [curV, oldV];
            }
        }
        else {
            var vid = getVertexUnderCursor(x, y);
            lastV = vid;
            lastEvtV = vid;
        }

        var won = true;
        for (idx in graph.V) {
            for (id2 in graph.V) {
                if (sm[idx][id2] && !marked[idx][id2]) won = false;
            }
        }
        renderGraph();
        if (won) return 1;
        return ret;
    }
    return ret;
}


