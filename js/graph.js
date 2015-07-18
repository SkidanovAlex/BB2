var sqr = function(a) { return a * a; }

var scalar = function(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

var dist = function(x1, y1, x2, y2) {
    return Math.sqrt(sqr(x1 - x2) + sqr(y1 - y2));
}

// returns a big number if the projection of (x1 y1) onto the line is outside of the segment
var distToLine = function(x1, y1, x2, y2, x3, y3) {
    if (scalar(x3 - x2, y3 - y2, x1 - x2, y1 - y2) < 0.01) return 1000;
    if (scalar(x2 - x3, y2 - y3, x1 - x3, y1 - y3) < 0.01) return 1000;
    var a = y3 - y2;
    var b = x2 - x3;
    var z = Math.sqrt(a * a + b * b);
    a /= z;
    b /= z;
    var c = a * x2 + b * y2;

    return Math.abs(a * x1 + b * y1 - c);
}

var generateGraph = function(vNum, eNum, enforceEuler, wantWeights)
{
    var w = 380;
    var h = 150;

    var v = [];
    var e = [];
    var degree = [];

    var sm = [];
    for (var i = 0; i < vNum; ++ i) {
        var lst = [];
        for (var j = 0; j < vNum; ++ j) {
            lst.push(0);
        }
        sm.push(lst);
        degree.push(0);
    }
    
    for (var i = 0; i < vNum; ++ i) {
        for (var attempt = 0; attempt < 200; ++ attempt) {
            var x = Math.floor(Math.random() * (w - 20) + 10);
            var y = Math.floor(Math.random() * (h - 20) + 10);
            var smallestDist = 1000;
            for (var j = 0; j < i; ++ j) {
                var curDist = dist(x, y, v[j].x, v[j].y);
                if (curDist < smallestDist) {
                    smallestDist = curDist;
                }
            }
            if (smallestDist < 50) {
                continue;
            }
            break;
        }

        v.push({'x' : x, 'y': y});
    }

    for (var i = 0; i < eNum; ++ i) {
        var candidates = [];
        var hasOddDegree = false;
        for (var j = 0; j < vNum; ++ j) if (degree[j] % 2) hasOddDegree = true;

        for (var attempt = 0; attempt < 100; ++ attempt) {
            var v1 = Math.floor(Math.random() * vNum);
            var v2 = Math.floor(Math.random() * vNum);
            if (sm[v1][v2] || v1 == v2) continue;
            if (enforceEuler && hasOddDegree && degree[v1] % 2 == 0 && degree[v2] % 2 == 0) {
                // use at least one odd degree, this way it will stay at no more than two
                //
                continue;
            }
            var ok = true;
            for (var v3 = 0; v3 < vNum; ++ v3) {
                if (v3 != v1 && v3 != v2) {
                    if (distToLine(v[v3].x, v[v3].y, v[v1].x, v[v1].y, v[v2].x, v[v2].y) < 20) ok = false;
                }
            }
            if (!ok) continue;
            candidates.push([v1, v2]);
            
        }
        var bestCandidate = candidates[0];
        var bestDistance = 1000;
        for (var idx in candidates) {
            var v1 = candidates[idx][0];
            var v2 = candidates[idx][1];
            var curDistance = dist(v[v1].x, v[v1].y, v[v2].x, v[v2].y);
            if (curDistance < bestDistance && Math.random() < 0.8) {
                bestDistance = curDistance;
                bestCandidate = candidates[idx];
            }
        }
        if (bestCandidate) {
            var v1 = bestCandidate[0];
            var v2 = bestCandidate[1];
            sm[v1][v2] = sm[v2][v1] = true;
            degree[v1] += 1;
            degree[v2] += 1;
            if (wantWeights) {
                bestCandidate.push(Math.floor(Math.random() * 50));
            }
            e.push(bestCandidate);
        }
    }

    return {'V': v, 'E': e};
}
