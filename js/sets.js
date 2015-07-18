var SetsPuzzle = function()
{
    var ret = {'dmg':13};
    var isActive = false;
    var c=0;
    var ctx=0;
    var size = 50;
    var diffX = 75;
    var bigX = 25;
    var bigY = 25;
    var coord = new Array();
    var ans = new Array();
    var chosen = new Array();
    var numb = new Array();

function rect(x, y , w , h, txt, stc_c, txt_f)
{
    ctx.font = txt_f;
    ctx.fillStyle = 'black';
    var tw = ctx.measureText(txt).width;
    ctx.fillText(txt, x + w / 2 - tw / 2, y + h /2 );
    ctx.strokeStyle = stc_c; 
    ctx.strokeRect(x, y, w, h);
}

function rect_fill(x, y , s)
{
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(x - 1, y - 1, s + 2, s + 2);
}

function rect_fill_2(x, y , s)
{
    ctx.fillStyle = '#B8B8B8';
    ctx.fillRect(x - 1, y - 1, s + 2, s + 2);
}


function rect_ans(x, y , w , h, txt, stc_c, txt_f, txt_c)
{
    ctx.font = txt_f;
    ctx.fillStyle = txt_c;
    var tw = ctx.measureText(txt).width;
    ctx.fillText(txt, x + w / 2 - tw / 2, y + h / 2);
    ctx.strokeStyle = stc_c; 
    ctx.strokeRect(x, y, w, h);
}

function diff(d, s)
{
    var arr = new Array();
    var j = 0;
    for(var i = 0; i < d.length; i++)
    {
        if (arr.indexOf(d[i]) == -1)
        {
            arr[j] = parseInt(d[i]);
            j++;
        }
    }
    for(var i = 0; i < s.length; i++)
    {
        if (arr.indexOf(s[i]) == -1)
        {
            arr[j] = parseInt(s[i]);
            j++;
        }
    }
    arr = arr.sort(ssort);
    return arr;
}

function ssort(a, b)
{
    return a - b;
}

function answer(x, y, all)
{
    var j = 0;
    if(all.length > 5)
    {
        var xx = x;
        var mid = 5;
        for(var i = 0; i < mid; i++)
        {
            rect_fill(x,y,size,size);
            rect_ans(x,y,size,size, all[i], '#808080', "15px Calibri", "black");
            coord[j] = {'x': x, 'y': y, 'size': size, 'ans' : all[i]};
            j++;
            x += diffX;
        }
        x = xx;
        for(var i = mid; i < all.length; i++)
        {
            rect_fill(x,y + 75,size,size);
            rect_ans(x,y + 75 ,size,size, all[i], '#808080', "15px Calibri", "black");
            coord[j] = {'x': x, 'y': y + 75, 'size': size, 'ans' : all[i]};
            j++;
            x += diffX;
        }


    }
    else
    {
        for(var i = 0; i < all.length; i++)
        {
            rect_fill(x,y,size,size);
            rect_ans(x,y,size,size, all[i], '#808080', "15px Calibri", "black");
            coord[j] = {'x': x, 'y': y, 'size': size, 'ans' : all[i]};
            j++;
            x += diffX;
        }
    }
}
function rect_all(x,y,arr)
{
    for(var i = 0; i < arr.length;i++)
    {
        rect_fill(x,y,size,size);
        rect(x,y,size,size, arr[i], '#808080', "15px Calibri");
        x+=diffX;
    }

}

function changeColor(c, r)
{
    if(c == 0) 
    {
        rect_fill(r.x, r.y , r.size);
        rect_ans(r.x, r.y , r.size , r.size, r.ans, '#808080', "15px Calibri", "black");
    }
    else
    {
        rect_fill_2(r.x, r.y , r.size);
        rect_ans(r.x, r.y , r.size , r.size, r.ans, 'black', "15px Calibri", "black");
    }
}

function is_correct(numb)
{
    var z = 0;
    for(var i = 0; i < ans.length; i++)
    {
        if(numb.indexOf(ans[i]) == -1)
        {
            return false;
        }
        else
        {
            z++;
        }
    }
    var zz = 0;
    for(var i = 0; i < numb.length; i++)
    {
        if(numb[i] != -1)
        {
            zz++;
        }
    }
    if(z == zz && z == ans.length)
        return true;
    return false;
}

    ret.getRandomState = function()
    {
        arr1 = new Array();
        arr2 = new Array();
        var both = Math.floor(Math.random()*3) + 1;
        for(var i = 0; i < both; i++)
        {
            while (true)
            {
                var z = Math.floor(Math.random()*20);
                if(arr1.indexOf(z) == -1)
                    break;
            }
            arr1[i] = z;
            arr2[i] = z;
        }
       for(var i = both; i < 5; i++)
        {
            while (true)
            {
                var z = Math.floor(Math.random()*20);
                if(arr1.indexOf(z) == -1)
                    break;
            }
            arr1[i] = z;
           while (true)
            {
                var z = Math.floor(Math.random()*20);
                if(arr2.indexOf(z) == -1)
                    break;
            }

            arr2[i] = z;
        }
        for(var j, x, i = arr1.length; i; j = parseInt(Math.random() * i), x = arr1[--i], arr1[i] = arr1[j], arr1[j] = x);
        for(var j, x, i = arr2.length; i; j = parseInt(Math.random() * i), x = arr2[--i], arr2[i] = arr2[j], arr2[j] = x);
        var what_to_do =Math.floor(Math.random()*2) //0 - inter, 1 - diff
        if(what_to_do == 0) //inter
        {
            var k = 0;
            for(var i = 0; i < arr1.length; i++)
            {
                for(var j = 0; j < arr2.length; j++)
                {
                    if(arr1[i] == arr2[j] && ans.indexOf(ans[i]) == -1)
                    {
                        ans[k] = arr1[i];
                        k++;
                    }
                }
            }
        }
        else if(what_to_do == 1)
        {
            var k =0; 
            for(var i = 0; i < arr1.length; i++)
            {
                if(arr2.indexOf(arr1[i])== -1)
                {
                    ans[k] = arr1[i];
                    k++;
                }

            }                
        }
        return [arr1, arr2, what_to_do];
    }

    ret.startGame = function(elem, state, active)
    {
        isActive = active;
        var dv = document.createElement("div");
        dv.innerHTML = "<canvas id='twolists" + active + "' width='400' height='450'></canvas>";

        elem.appendChild(dv);
        c=document.getElementById("twolists" + active);
        ctx=c.getContext("2d");
        rect_all(bigX, bigY, state[0]);
        rect_all(bigX, bigY + 75, state[1]);
        var all = diff(state[0], state[1]);
        answer(bigX, bigY + 75+75 + 125, all);

        var wht = state[2];
        if(wht == 0)
        {
            wht = "INTERSECTION";
        }
        else if(wht == 1)
        {
            wht = "DIFFERENCE";
        }
        var text = "Find the set <b>" + wht + "</b> of the two sets above. Tap numbers of resulting set below.";
        var dv3 = creatediv(elem,2,text,350-6,100-6,bigX,bigY + 75 + 75, '#888');
    }
    ret.applyEvent = function(evt)
    {
        if(evt[1] == 0)
            changeColor(0, evt[0]);
        else
            changeColor(1, evt[0]);

    }
    ret.onTapDown = function(fingers)
    {
    }
    ret.onTapMove = function(fingers)
    {
    }
    ret.onTapUp = function(fingers)
    {
        var res = -1;
        for(var i = 0; i < fingers.length; i++)
        {
            {
                fingers[i][1] -= 5;
                fingers[i][2] -= 5;
                for(var j = 0; j < coord.length; j++)

                    if(fingers[i][1] >= coord[j].x && fingers[i][1] <= coord[j].x + coord[j].size)
                    {
                        if(fingers[i][2] >= coord[j].y && fingers[i][2] <= coord[j].y + coord[j].size)
                        {
                            res = j;
                            break;
                        }
                    }
            }
        }
        if(res != -1)
        {
            var col = 0;
            if (chosen.indexOf(j) == -1)
            {
                chosen.push(j);
                numb.push(coord[j].ans);
                col = 1;
            }
            else
            {
                var ch1 = new Array();
                var nm1 = new Array();
                for(var i = 0; i < chosen.length; i++)
                {   
                    if(chosen[i] != j)
                    {
                        ch1.push(chosen[i]);
                        nm1.push(numb[i]);
                    }
                }
                chosen = ch1;
                numb = nm1;
                col = 0;
            }
            if(is_correct(numb))
            {
                return 1;
            }
            else
            {
                return [coord[j], col];
            }

        }
        else
        {
            return 0;
        }
    }
    return ret;


}

