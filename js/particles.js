var x_iterations = 30;
var x_delay = 11;

var particleTypes = [
    [ 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 0)' ],
    [ 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 0)' ],
    [ 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 255, 0)' ],
    [ 'rgba(255, 255, 0, 1)', 'rgba(255, 255, 0, 0)' ],
//    [ 'rgba(255, 200, 0, 1)', 'rgba(255, 200, 0, 0)' ],
//    [ 'rgba(230, 180, 0, 1)', 'rgba(230, 180, 0, 0)' ],
    [ 'rgba(200, 200, 200, 1)', 'rgba(200, 200, 200, 0)' ],
    [ 'rgba(170, 170, 170, 1)', 'rgba(170, 170, 170, 0)' ],
    [ 'rgba(50, 50, 50, 1)', 'rgba(50, 50, 50, 0)' ],
    [ 'rgba(100, 100, 100, 1)', 'rgba(100, 100, 100, 0)' ],
    [ 'rgba(150, 150, 150, 1)', 'rgba(150, 150, 150, 0)' ],
    [ 'rgba(200, 200, 255, 1)', 'rgba(200, 200, 255, 0)' ],
];

var particleData = [
];

var buildParticle = function(ctx, clr1, clr2) {
    var r = 25;
    var grd = ctx.createRadialGradient(25, 25, 0, 25, 25, r);

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 50, 50);

    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(25 - r, 25 - r, r * 2, r * 2);
    grd.addColorStop(0, clr1);
    grd.addColorStop(1, clr2);
    ctx.fillStyle = grd;
    ctx.fillRect(25 - r, 25 - r, r * 2, r * 2);
}

var buildParticles = function() {

//    document.body.appendChild(elem);

    for (var i = 0; i < particleTypes.length; ++ i) {
        var elem = document.createElement('canvas');
        elem.width = 50;
        elem.height = 50;

        var ctx = elem.getContext('2d');
        buildParticle(ctx, particleTypes[i][0], particleTypes[i][1]);
        particleData.push(elem.toDataURL());
    }
}

var particlesStart = function(particles, expl, ex, ey, eid, who, level)
{
    var iterations = x_iterations;
    var it = setInterval(function() {
        for (var speed = 0; speed < 2; ++ speed)
        {
            for (var i in particles)
            {
                -- particles[i].delay;
                if (expl && particles[i].delay <= - (x_iterations - x_delay))
                {
                    particles[i].elem.style.display = 'none';
                }
                else if (particles[i].delay <= 0)
                {
                    particles[i].dx += particles[i].ddx;
                    particles[i].dy += particles[i].ddy;
                    particles[i].x += particles[i].dx;
                    particles[i].y += particles[i].dy;
                    particles[i].elem.style.left = particles[i].x + 'px';
                    particles[i].elem.style.top = particles[i].y + 'px';
                    particles[i].elem.style.display = '';
                }

                if (!expl)
                {
                    particles[i].elem.style.opacity = 1.0 * iterations / x_iterations;
                }
            }
            -- iterations;
            if (iterations <= 0)
            {
                clearTimeout(it);
                for (var i in particles)
                {
                    document.body.removeChild(particles[i].elem);
                }
            }
            else if (expl && iterations == x_delay)
            {
                particlesExplode(ex, ey, eid);
                life(who, level);
            }
        }
    }, 40);
}

var particlesExplode = function(x, y, id)
{
    var num = 40;

    var particles = [];
    for (var i = 0; i < num; ++ i)
    {
        var dx = Math.random() * 4 - 2;
        var dy = Math.random() * 4 - 2;
        var particle = {
            'x': x - 24 + dx,
            'y': y - 24 + dy,
            'dx': dx,
            'dy': dy,
            'ddy': 0,
            'ddx': 0,
            'delay': 0,
            'elem': document.createElement('img')
        };
//        particle.elem.style.background = '-webkit-radial-gradient(50% 50%, ellipse cover, red 0%, rgba(0, 0, 0, 0) 100%)';
        particle.elem.src = particleData[i + i < num ? 6 : Math.round(Math.random()) + 4];
        particle.elem.style.position = 'absolute';
        particle.elem.style.left = x - 24 + dx + 'px';
        particle.elem.style.top = y - 24 + dy + 'px';
        particle.elem.style.width = '48px';
        particle.elem.style.height = '48px';
        document.body.appendChild(particle.elem);
        particles.push(particle);
    }
    particlesStart(particles, false);
}

var particlesShoot = function(x1, y1, x2, y2, id, who, level)
{
    var num = 40;
    
    var particles = [];
    for (var i = 0; i + i < num; ++ i)
    {
        var particle = {
            'x': x1 - 24 + Math.floor(Math.random() * 24 - 12),
            'y': y1 - 24 + Math.floor(Math.random() * 24 - 12),
            'dx': Math.floor((x2 - x1) / (x_iterations - x_delay)),
            'dy': Math.floor((y2 - y1) / (x_iterations - x_delay)),
            'ddy': 0,
            'ddx': 0,
            'delay': Math.floor((num - i) * x_delay / num),
            'elem': document.createElement('img')
        };
//        particle.elem.style.background = '-webkit-radial-gradient(50% 50%, ellipse cover, red 0%, rgba(0, 0, 0, 0) 100%)';
        particle.elem.style.display = 'none';
        particle.elem.src = particleData[6];
        particle.elem.style.position = 'absolute';
        particle.elem.style.left = particle.x + 'px';
        particle.elem.style.top = particle.y + 'px';
        particle.elem.style.width = '48px';
        particle.elem.style.height = '48px';
        document.body.appendChild(particle.elem);
        particles.push(particle);
    }
    for (var i = 0; i < num; ++ i)
    {
        var particle = {
            'x': x1 - 24 + Math.floor(Math.random() * 24 - 12),
            'y': y1 - 24 + Math.floor(Math.random() * 24 - 12),
            'dx': Math.floor((x2 - x1) / (x_iterations - x_delay)),
            'dy': Math.floor((y2 - y1) / (x_iterations - x_delay)),
            'ddy': 0,
            'ddx': 0,
            'delay': Math.floor((num - i) * x_delay / num),
            'elem': document.createElement('img')
        };
//        particle.elem.style.background = '-webkit-radial-gradient(50% 50%, ellipse cover, red 0%, rgba(0, 0, 0, 0) 100%)';
        particle.elem.style.display = 'none';
        particle.elem.src = particleData[Math.round(Math.random()) + 4];
        particle.elem.style.position = 'absolute';
        particle.elem.style.opacity = (i) / num;
        particle.elem.style.left = particle.x + 'px';
        particle.elem.style.top = particle.y + 'px';
        particle.elem.style.width = '48px';
        particle.elem.style.height = '48px';
        document.body.appendChild(particle.elem);
        particles.push(particle);
    }
    particlesStart(particles, true, x2, y2, id, who, level);
}

var shoot = function(who, level)
{
    if (who == 2)
    {
        particlesShoot(410, 20, 600, 230, Math.floor(Math.random() * 4), who, level);
    }
    else
    {
        particlesShoot(410, 20, 200, 230, Math.floor(Math.random() * 4), who, level);
    }
}

buildParticles();
