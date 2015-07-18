var SamplePuzzle = function()
{
    var ret = {'dmg': 5};
    var isActive = false;

    // Generates a new puzzle. This is called when the puzzle starts, and the returned value
    //     is then passed to the startGame for both players
    //
    ret.getRandomState = function()
    {
        return [1, 2, 3, 4, 5, 6];
    }

    // This is called once for both players (active = true for the one who has this puzzle)
    // This is a good place to instantiate the DOM, put the objective
    //
    ret.startGame = function(elem, state, active)
    {
        isActive = active;
        var dv = document.createElement("div");
        dv.innerHTML = state.join(',');
        elem.appendChild(dv);
    }
    // evt is something produced by onTapUp. This function better be idempotent
    //
    ret.applyEvent = function(evt)
    {
        alert(evt);
    }
    ret.onTapDown = function(fingers)
    {
    }
    ret.onTapMove = function(fingers)
    {
    }
    // Returns 1 if the player won, something to pass to applyEvent if some events were produced
    //     or something falsy if nothing happened
    //
    var sampleDoDmg = true;
    ret.onTapUp = function(fingers)
    {
        sampleDoDmg = !sampleDoDmg;
        if (sampleDoDmg) return 1;
        return fingers[0];
    }

    return ret;
}

