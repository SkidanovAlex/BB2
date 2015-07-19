var puzzles = [EulerPuzzle, SetsPuzzle, BayesPuzzle, HomeoPuzzle];
var puzzles = [HomeoPuzzle];
var lid = 0; var upd_interval = 0;

var myId = 0, oppId = 0;
var myPuzzle = 0, oppPuzzle = 0;
var myDiv = 0; oppDiv = 0;

var life = function(who, level)
{
    if(who == 1) //me
    {
        var div = 'myDivLive';
        var lf = parseInt(document.getElementById(div).innerHTML);
        lf -= level;
        document.getElementById(div).innerHTML = lf;
        var maxL = 100;
        var procent = parseInt((400 * lf) / 100); 
        var g = 255 * lf / maxL;
        var r = 255 * (maxL - lf) / maxL;
        var w = procent;
        //document.getElementById(div).style.backgroundColor = "rgb(" + parseInt(r) + "," + parseInt(g) + ",0)";
        document.getElementById(div).style.backgroundColor = "rgb(" + parseInt((g + 0.15) * 0.7) + "," + parseInt((g + 0.15) * 0.7) + "," + parseInt((g + 0.15) * 0.7) + ")";
        if(lf <= 0)
        {
            document.getElementById(div).style.width = "0px";
            requestFight2("Sorry, you lost");
        }
        else 
        {
            document.getElementById(div).style.width = w + "px";
        }

    }
    else
    {
        var div = 'oppDivLive';
        var lf = parseInt(document.getElementById(div).innerHTML);
        lf -= level;
        var maxL = 100;
        var g = 255 * lf / maxL;
        var r = 255 * (maxL - lf) / maxL;
        //document.getElementById(div).style.backgroundColor = "rgb(" + parseInt(r) + "," + parseInt(g) + ",0)";
        document.getElementById(div).style.backgroundColor = "rgb(" + parseInt((g + 0.15) * 0.7) + "," + parseInt((g + 0.15) * 0.7) + "," + parseInt((g + 0.15) * 0.7) + ")";
        var procent = parseInt((400 * lf) / 100);
        var l = 400 - procent;
        var w = procent; 
        document.getElementById(div).innerHTML = lf;
        if(lf <= 0)
        {               
            document.getElementById(div).style.width = "0px";
            document.getElementById(div).style.left = "390px"
            requestFight2("You WON");
        }                               
        else 
        {                 
            document.getElementById(div).style.left = l + "px";
            document.getElementById(div).style.width = w + "px";
        }                     

    }

}

var garbage = function()
{
    var g = "/";
    for (var i = 0; i < 20; ++ i)
    {
        g += Math.floor(Math.random() * 10);
    }
    return g;
}

var startNewPuzzle = function()
{
    myDiv.innerHTML = "";

    var puzzleId = Math.floor(Math.random() * puzzles.length);
    var puzzle = puzzles[puzzleId]();
    var state = puzzle.getRandomState();
    puzzle.startGame(myDiv, state, true);

    var evt = [1, puzzleId, state];
    query("/send/" + myId + "/" + encodeURIComponent(JSON.stringify(evt)) + garbage());

    myPuzzle = puzzle;
}

var isMouseButtonPressed = false;
var curTapId = 1; // imitate unique tap ids with the mouse
document.onmousedown = function(evt)
{
    isMouseButtonPressed = true;
    ++ curTapId;
    if (myPuzzle != 0)
    {
        myPuzzle.onTapDown([[curTapId, evt.pageX, evt.pageY]]);
    }
}
document.onmousemove = function(evt)
{
    if (myPuzzle != 0 && isMouseButtonPressed)
    {
        myPuzzle.onTapMove([[curTapId, evt.pageX, evt.pageY]]);
    }
}

document.onmouseup = function(evt)
{
    if (myPuzzle != 0 && isMouseButtonPressed)
    {
        isMouseButtonPressed = false;
        var res = myPuzzle.onTapUp([[curTapId, evt.pageX, evt.pageY]]);
        if (res === 0) { } // nothing happened
        else if (res === 1)
        {
            var evt = [3];
            query("/send/" + myId + "/" + JSON.stringify(evt) + garbage());
            shoot(2, myPuzzle.dmg);
            startNewPuzzle();
        }
        else
        {
            myPuzzle.applyEvent(res);
            var evt = [2, res];
            query("/send/" + myId + "/" + JSON.stringify(evt) + garbage());
        }
    }
}

function opponentEvent(evt)
{
    if (evt[0] == 1)
    {
        oppDiv.innerHTML = "";
        var puzzleId = evt[1];
        var puzzle = puzzles[puzzleId]();
        var state = evt[2];
        puzzle.startGame(oppDiv, state, false);
        oppPuzzle = puzzle;
    }
    else if (evt[0] == 2)
    {
        oppPuzzle.applyEvent(evt[1]);
    }
    else if (evt[0] == 3)
    {
        shoot(1, oppPuzzle.dmg);
    }
}

function waitForOpp()
{
    document.getElementById('myDivIdOuter').style.display = 'none';
    document.getElementById('oppDivIdOuter').style.display = 'none';
    document.getElementById('waiting').style.display = '';
    setTimeout(requestFight, 1000);
}

function startGame(_oppId)
{
    if (upd_interval) clearInterval(upd_interval);
    upd_interval = setInterval(requestUpdate, 1000);

    oppId = _oppId;
    document.getElementById('myDivIdOuter').style.display = '';
    document.getElementById('oppDivIdOuter').style.display = '';
    document.getElementById('waiting').style.display = 'none';
    startNewPuzzle();

    callOpp();
}

function requestUpdate()
{
    query("/update/" + oppId + "/" + lid + garbage());
}

function requestFight()
{
    if (upd_interval) clearInterval(upd_interval);
    document.getElementById('myDivLive').innerHTML = '100';
    document.getElementById('oppDivLive').innerHTML = '100';
    document.getElementById('myDivLive').style.width = '400px';
    document.getElementById('oppDivLive').style.width = '400px';
    document.getElementById('oppDivLive').style.left = '0px';
    life(1, 0);
    life(2, 0);

    query("/fight/" + myId + garbage());
}

function requestFight2(str)
{
    document.getElementById('ggMessage').innerHTML = "<b><center>" + str + "</center></b>";
    waitForOpp();
}

// This is for objectives
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

var myId = '';
for (var i = 0; i < 20; ++ i)
{
    myId += Math.floor(Math.random() * 10);
}
