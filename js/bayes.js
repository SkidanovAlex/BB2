var BayesPuzzle = function()
{
    var ret = {};
    var isActive = false;
    var clauses, values, and;

    var blocks = [];
    var vblocks = [];

    var solved = false;
    var evts = [];

    var concat = function(a, b) {
        var ret = [];
        for (var idx in a) ret.push(a[idx]);
        for (var idx in b) ret.push(b[idx]);
        return ret;
    }

    var expand = function(what, depth) {
        if (depth <= 0) {
            return [what];
        }
        var kind = Math.floor(Math.random() * 2);
        if (what[2]) { // P(X|Y)
            if (what[0] == what[1]) {
                console.log("Something went wrong, Bayes puzzle");
            }
            if (kind == 0) {
                return concat([[what[1], what[0], 1]], concat(expand([what[0], what[0], 0], depth - 1), expand([what[1], what[1], 0], depth - 2)));
            }
            else if (kind == 1) {
                return concat([[what[1], what[0], 0]], expand([what[1], what[1], 0], depth - 1));
            }
        }
        else if (what[0] == what[1]) { // P(X)
            return concat([[what[0], 3, 0]], expand([what[0], -3, 0], depth - 1));
        }
        else { // P(X, Y)
            if (kind == 0) {
                return concat([[what[0], what[1], 1]], expand([what[1], what[1], 0], depth - 1));
            }
            else if (kind == 1) {
                return concat([[what[1], what[0], 1]], expand([what[0], what[0], 0], depth - 1));
            }
        }
    }

    var evaluate = function(expr, p) {
        if (expr[2]) { // P(X|Y)
            return evaluate([expr[0], expr[1], 0],p) / evaluate([expr[1], expr[1], 0], p);
        }
        else if (expr[0] == expr[1]) { // P(X)
            if (expr[0] > 0) return p[expr[0] - 1][expr[0] - 1];
            else return 1 - p[- expr[0] - 1][- expr[0] - 1];
        }
        else { // P(X,Y)
            var p1 = Math.abs(expr[0]);
            var p2 = Math.abs(expr[1]);
            var ret = p[p1 - 1][p2 - 1];
            if (p1 != expr[0]) {
                ret = evaluate([p2, p2, 0], p) - ret;
                p1 = -p1;
            }
            if (p2 != expr[1]) {
                ret = evaluate([p1, p1, 0], p) - ret;
                p2 = -p2;
            }
            if (p1 != expr[0] || p2 != expr[1]) {
                console.log("Failure during evaluation of P(X,Y)");
            }
            return ret;
        }
    }

    ret.getRandomState = function()
    {
        var p = [[0,0,0],[0,0,0],[0,0,0]];

        for (var i = 0; i < 3; ++ i) {
            p[i][i] = Math.floor(Math.random() * 80 + 10) / 100.0;
        }
        for (var i = 0; i < 3; ++ i) {
            for (var j = i + 1; j < 3; ++ j) {
                var mx = Math.min(p[i][i], p[j][j]);
                var mn = p[i][i] * p[j][j];
                p[i][j] = p[j][i] = Math.random() * (mx - mn) + mn;
            }
        }

        var want = [1, 2, true];
        var given = expand(want, 3);
        given.sort();
        var given_u = [];
        var values = [];
        for (var idx in given) {
            if (idx == 0 || given[idx] != given[idx - 1]) {
                given_u.push(given[idx]);
                values.push(evaluate(given[idx], p));
            }
        }

        // This is the only retarded one I know of
        //
        if (JSON.stringify(given_u[1]) == JSON.stringify([2, 1, 0]) && JSON.stringify(given_u[2]) == JSON.stringify([2, 2, 0])) return ret.getRandomState();

        return [given_u, values, evaluate([1, 2, 1], p)];
    }

    var getClauseStr = function(c) {
        var vars = {'-3': '<span style="text-decoration: overline">Z</span>', '-2': '<span style="text-decoration: overline">Y</span>', '-1': '<span style="text-decoration: overline">X</span>', '1': 'X', '2': 'Y', '3': 'Z'};
        if (c[2]) {
            return 'P(' + vars[c[0]] + '|' + vars[c[1]] + ')';
        }
        else if (c[0] == c[1]) {
            return 'P(' + vars[c[0]] + ')';
        }
        else {
            return 'P(' + vars[c[0]] + ',' + vars[c[1]] + ')';
        }
    }

	function creatediv(elem,id, html, width, height, left, top, borderclr) {

        var newdiv = document.createElement('div'); 
        newdiv.setAttribute('id', id); 
        if (width) { newdiv.style.width = width; } 
        if (height) { newdiv.style.height = height; } 
        if ((left || top) || (left && top)) 
        { newdiv.style.position = "absolute"; 
            if (left) 
            { newdiv.style.left = left; } 
            if (top) { newdiv.style.top = top; } } 
            newdiv.style.border = "4px solid " + borderclr; 
            newdiv.style.backgroundColor = "#e8e8e8"; 
            //newdiv.style.borderradius = '10px';
                if (html) { newdiv.innerHTML = "<center>" + html + "</center>"; } 
                else { newdiv.innerHTML = "nothing"; } 
        elem.appendChild(newdiv);
	}

    function getRounded3(x) {
        x = Math.round(x * 1000) / 1000.0;
        return x < 1 && x > 0 ? ("" + x).substr(1) : "" + x;
    }

    var lastDragged = undefined;
    var bringToFrontListener = function(elem) {
        elem.on('mousedown', function() {
            if (lastDragged) {
                lastDragged.zIndex(0);
            }
            elem.zIndex(1);
            lastDragged = elem;
        });
    }

    function droppableBlock(td, func) { // note that func needs to be idempotent, it will be called twice
        var uid = vblocks.length;
        vblocks.push({'td': td, 'func': func});
        if (!isActive) return;

        td.droppable({
            'drop': function(evt, ui) {
                var src = $(ui.draggable);
                if (src.data() && src.data().value) {
                    evts.push(['assign', uid, src.data().value]);
                    func(src.data().value);
                }
            }
        });
    }

    var constantBlock = function(div, value) {
        if (!isActive) return;

        div.data('value', value);
        div.draggable(
                {
                    'helper': function() { return $('<span>', { 'text': getRounded3(div.data().value), 'class': 'ui-widget' })
                                                         .css('width', '48px')
                                                         .css('height', '25px')
                                                         .css('border', '1px solid #808080')
                                                         .css('background-color', '#E8E8E8')
                                                         .css('text-align', value == 1 ? 'center' : 'left')
                                                         .data('value', value)
                                                         .zIndex(2); },
                    'appendTo': 'body',
                    'revert': true,
                    'revertDuration': 0
                }
                );
    }

    var buildingBlock = function(pr, div, t1, t2, func) {
        var uid = blocks.length;
        blocks.push(div);

        var tblO = $('<table>').css('position', 'absolute').css('left', div.width() + 'px').css('top', 5 + (div.height() - 35) / 2 + 'px').attr('cellspacing', 0).attr('cellpadding', 0).appendTo(div).width(75);
        var tbl = $('<tbody>').appendTo(tblO);

        var td2 = $('<td>').html('=').css('width', '25px').css('height', '25px').css('text-align', 'center');
        var td3 = $('<td>').text('5').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
        var tr = $('<tr>').appendTo(tbl).append(td2).append(td3);
        constantBlock(td3, 0); // value will be overwritten

        tblO.hide();

        var handler = function() {
            if (t1.data() && t1.data().value && t2.data() && t2.data().value) {
                tblO.show();
                var val = func(t1.data().value, t2.data().value);
                td3.text(getRounded3(val));
                td3.data('value', val);
            }
        }

        droppableBlock(t1, handler);
        droppableBlock(t2, handler);

        if (!isActive) return;

        bringToFrontListener(div);
        div.draggable({'stop': function(evt, ui) { evts.push(['move', uid, ui.position]) }});
    }

    ret.startGame = function(elem, state, active)
    {
        clauses = state[0];
        values = state[1];
        ans = state[2];
        isActive = active;

        // Givens
        var tblO = $('<table>').css('position', 'absolute').css('left', '0px').css('top', '25px').attr('cellspacing', 0).attr('cellpadding', 0);
        var tbl = $('<tbody>').appendTo(tblO);

        for (var idx in clauses) {
            var td1 = $('<td>').html('<b>' + getClauseStr(clauses[idx]) + '</b>').css('width', '75px').css('height', '25px').css('text-align', 'right');
            var td2 = $('<td>').text('=').css('width', '25px').css('height', '25px').css('text-align', 'center');
            var td3 = $('<td>').text(getRounded3(values[idx])).css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var tr = $('<tr>').appendTo(tbl).append(td1).append(td2).append(td3);
            constantBlock(td3, values[idx]);
        } 
        $(elem).append(tblO);

        // Objective
        var tblO = $('<table>').css('position', 'absolute').css('left', '225px').css('top', '400px').attr('cellspacing', 0).attr('cellpadding', 0);
        var tbl = $('<tbody>').appendTo(tblO);

        var td1 = $('<td>').html('<b>' + getClauseStr([1, 2, 1]) + '</b>').css('width', '75px').css('height', '25px').css('text-align', 'right');
        var td2 = $('<td>').text('=').css('width', '25px').css('height', '25px').css('text-align', 'center');
        var td3 = $('<td>').text(' ').css('width', '50px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
        var tr = $('<tr>').appendTo(tbl).append(td1).append(td2).append(td3);

        droppableBlock(td3, function(val) { if (Math.abs(val - ans) < 0.001) solved = true; });

        $(elem).append(tblO);

        // OK, here we will cheat and create multiple copies of this hackery, so that I don't need to clone them later
        //
        for (var i = 0; i < 5; ++ i) {
            // Add
            var div = $('<div>').css('position', 'absolute').css('left', '170px').css('top', '20px').css('width', '135px').css('height', '35px').css('background-color', '#C8C8C8').css('border', '1px solid black').attr('cellspacing', 0).attr('cellpadding', 0);
            var tblO = $('<table>').css('position', 'absolute').css('left', '5px').css('top', '5px').attr('cellspacing', 0).attr('cellpadding', 0).appendTo(div);
            var tbl = $('<tbody>').appendTo(tblO);

            var td1 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var td2 = $('<td>').text('+').css('width', '25px').css('height', '25px').css('text-align', 'center');
            var td3 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var tr = $('<tr>').appendTo(tbl).append(td1).append(td2).append(td3);

            buildingBlock($(elem), div, td1, td3, function(x, y) { return x + y; })
            $(elem).append(div);

            // Sub
            var div = $('<div>').css('position', 'absolute').css('left', '170px').css('top', '70px').css('width', '135px').css('height', '35px').css('background-color', '#C8C8C8').css('border', '1px solid black').attr('cellspacing', 0).attr('cellpadding', 0);
            var tblO = $('<table>').css('position', 'absolute').css('left', '5px').css('top', '5px').attr('cellspacing', 0).attr('cellpadding', 0).appendTo(div);
            var tbl = $('<tbody>').appendTo(tblO);

            var td1 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var td2 = $('<td>').html('&ndash;').css('width', '25px').css('height', '25px').css('text-align', 'center');
            var td3 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var tr = $('<tr>').appendTo(tbl).append(td1).append(td2).append(td3);

            buildingBlock($(elem), div, td1, td3, function(x, y) { return x - y; })
            $(elem).append(div);

            // Mult
            var div = $('<div>').css('position', 'absolute').css('left', '170px').css('top', '120px').css('width', '135px').css('height', '35px').css('background-color', '#C8C8C8').css('border', '1px solid black').attr('cellspacing', 0).attr('cellpadding', 0);
            var tblO = $('<table>').css('position', 'absolute').css('left', '5px').css('top', '5px').attr('cellspacing', 0).attr('cellpadding', 0).appendTo(div);
            var tbl = $('<tbody>').appendTo(tblO);

            var td1 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var td2 = $('<td>').html('&middot;').css('width', '25px').css('height', '25px').css('text-align', 'center');
            var td3 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var tr = $('<tr>').appendTo(tbl).append(td1).append(td2).append(td3);

            buildingBlock($(elem), div, td1, td3, function(x, y) { return x * y; })
            $(elem).append(div);

            // Division
            var div = $('<div>').css('position', 'absolute').css('left', '320px').css('top', '20px').css('width', '60px').css('height', '85px').css('background-color', '#C8C8C8').css('border', '1px solid black').attr('cellspacing', 0).attr('cellpadding', 0);
            var tblO = $('<table>').css('position', 'absolute').css('left', '5px').css('top', '5px').attr('cellspacing', 0).attr('cellpadding', 0).appendTo(div);
            var tbl = $('<tbody>').appendTo(tblO);

            var td1 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var td2 = $('<td>').html('<hr color=black>').css('width', '25px').css('height', '25px').css('text-align', 'center');
            var td3 = $('<td>').text(' ').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080');
            var tr1 = $('<tr>').appendTo(tbl).append(td1);
            var tr2 = $('<tr>').appendTo(tbl).append(td2);
            var tr3 = $('<tr>').appendTo(tbl).append(td3);

            buildingBlock($(elem), div, td1, td3, function(x, y) { return y == 0 ? 0 : x / y; })
            $(elem).append(div);
        }

        // constant=1
        var div = $('<div>').css('position', 'absolute').css('left', '320px').css('top', '120px').css('width', '60px').css('height', '35px').css('background-color', '#C8C8C8').css('border', '1px solid black').attr('cellspacing', 0).attr('cellpadding', 0);
        var tblO = $('<table>').css('position', 'absolute').css('left', '5px').css('top', '5px').attr('cellspacing', 0).attr('cellpadding', 0).appendTo(div);
        var tbl = $('<tbody>').appendTo(tblO);

        var td = $('<td>').text('1').css('width', '48px').css('height', '25px').css('background-color','#E8E8E8').css('border', '1px solid #808080').css('text-align', 'center');
        var tr = $('<tr>').appendTo(tbl).append(td);

        constantBlock(td, 1);
        $(elem).append(div);

        var text = "Given probabilities above, compute <b>P(X|Y)</b>.<br>Drag and drop building blocks from above to the area below for intermediate computations.";
        var dv3 = creatediv(elem,2,text,350-6,100-6,25,25 + 75 + 75, '#888');
    }
    ret.applyEvent = function(evts)
    {
        for (var idx in evts) {
            var evt = evts[idx];
            console.log(evt);
            if (evt[0] == 'move') {
                blocks[evt[1]].css(evt[2]);
            }
            else if (evt[0] == 'assign') {
                var td = vblocks[evt[1]].td;
                var func = vblocks[evt[1]].func;
                var value = evt[2];
                td.text(getRounded3(value))
                  .data('value', value)
                  .css('text-align', 'center');
                func(value);
            }
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
        var ret = evts;
        evts = [];
        return ret;
    }
    return ret;
}


